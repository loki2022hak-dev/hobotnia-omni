import { Body, Controller, ForbiddenException, Get, Param, Post } from '@nestjs/common';
import { NotificationType } from '../generated/prisma';
import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatGateway } from './chat.gateway';

class ChatDto { @IsOptional() @IsString() title?: string; @IsBoolean() isGroup!: boolean; @IsArray() memberIds!: string[]; }
class MessageDto { @IsString() @MinLength(1) content!: string; @IsOptional() @IsArray() attachments?: string[]; }

@Controller('chats')
export class ChatController {
  constructor(private prisma: PrismaService, private notifications: NotificationsService, private gateway: ChatGateway) {}
  @Get() list(@CurrentUser() user: any) {
    return this.prisma.chat.findMany({ where: { members: { some: { userId: user.sub } } }, include: { members: { include: { user: { select: { id: true, username: true } } } }, messages: { take: 1, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
  }
  @Post() create(@CurrentUser() user: any, @Body() dto: ChatDto) {
    const ids = Array.from(new Set([user.sub, ...dto.memberIds]));
    return this.prisma.chat.create({ data: { title: dto.title, isGroup: dto.isGroup, members: { create: ids.map(userId => ({ userId })) } } });
  }
  async assertMember(chatId: string, userId: string) {
    const member = await this.prisma.chatMember.findUnique({ where: { chatId_userId: { chatId, userId } } });
    if (!member) throw new ForbiddenException('Немає доступу до чату');
  }
  async messages(@CurrentUser() user: any, @Param('id') id: string) {
    await this.assertMember(id, user.sub);
    return this.prisma.message.findMany({ where: { chatId: id }, orderBy: { createdAt: 'asc' }, take: 100, include: { author: { select: { id: true, username: true } } } });
  }
  @Get(':id/messages') getMessages(@CurrentUser() user: any, @Param('id') id: string) { return this.messages(user, id); }
  @Post(':id/messages') async message(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: MessageDto) {
    await this.assertMember(id, user.sub);
    const message = await this.prisma.message.create({ data: { chatId: id, authorId: user.sub, content: dto.content, attachments: dto.attachments ?? [] }, include: { author: { select: { username: true } }, chat: { include: { members: true } } } });
    this.gateway.server.to(id).emit('chat:message', message);
    await Promise.all(message.chat.members.filter((member) => member.userId !== user.sub).map((member) => this.notifications.create(member.userId, NotificationType.MESSAGE, 'Нове повідомлення', `@${message.author.username}: ${message.content}`)));
    return message;
  }
}
