import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { NotificationType } from '../generated/prisma';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

class CreateCommentDto { @IsString() @MinLength(1) content!: string; @IsOptional() @IsString() parentId?: string; }

@Controller()
export class CommentsController {
  constructor(private prisma: PrismaService, private notifications: NotificationsService) {}
  @Public() @Get('posts/:postId/comments')
  list(@Param('postId') postId: string) { return this.prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, username: true, profile: true } }, replies: true } }); }
  @Post('posts/:postId/comments')
  async create(@CurrentUser() user: any, @Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({ data: { postId, authorId: user.sub, content: dto.content, parentId: dto.parentId }, include: { author: { select: { username: true } }, post: true } });
    if (comment.post.authorId !== user.sub) {
      await this.notifications.create(comment.post.authorId, NotificationType.COMMENT, 'Новий коментар', `@${comment.author.username} прокоментував твій пост`);
    }
    return comment;
  }
  @Delete('comments/:id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException();
    if (comment.authorId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'comment.delete', entity: 'comment', entityId: id } });
    return this.prisma.comment.delete({ where: { id } });
  }
}
