import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post } from '@nestjs/common';
import { Visibility } from '../generated/prisma';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

class CreateCommunityDto {
  @IsString() @Length(3, 80) name!: string;
  @IsString() @Length(3, 60) slug!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
}

@Controller('communities')
export class CommunitiesController {
  constructor(private prisma: PrismaService) {}
  @Public() @Get() list() { return this.prisma.community.findMany({ include: { _count: { select: { members: true, posts: true } } }, orderBy: { createdAt: 'desc' } }); }
  @Post() create(@CurrentUser() user: any, @Body() dto: CreateCommunityDto) {
    return this.prisma.community.create({ data: { ...dto, ownerId: user.sub, members: { create: { userId: user.sub, role: 'ADMIN' } } } });
  }
  @Post(':id/join') join(@CurrentUser() user: any, @Param('id') id: string) {
    return this.prisma.communityMember.upsert({ where: { userId_communityId: { userId: user.sub, communityId: id } }, update: {}, create: { userId: user.sub, communityId: id } });
  }
  @Patch(':id') async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateCommunityDto) {
    const community = await this.prisma.community.findUniqueOrThrow({ where: { id } });
    if (community.ownerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'community.update', entity: 'community', entityId: id } });
    return this.prisma.community.update({ where: { id }, data: dto });
  }
  @Delete(':id') async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const community = await this.prisma.community.findUniqueOrThrow({ where: { id } });
    if (community.ownerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'community.delete', entity: 'community', entityId: id } });
    return this.prisma.community.delete({ where: { id } });
  }
}
