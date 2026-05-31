import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

class UpdateProfileDto {
  @IsOptional() @IsString() avatarUrl?: string; @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() bio?: string; @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() status?: string; @IsOptional() @IsObject() socialLinks?: Record<string, string>;
}

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}
  @Get('me') me(@CurrentUser() user: any) { return this.prisma.user.findUnique({ where: { id: user.sub }, include: { profile: true, _count: { select: { posts: true, comments: true } }, achievements: { include: { achievement: true } } } }); }
  @Patch('me') async updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    if (dto.status) await this.prisma.user.update({ where: { id: user.sub }, data: { status: dto.status } });
    const { status, ...profile } = dto;
    const updated = await this.prisma.profile.upsert({ where: { userId: user.sub }, create: { userId: user.sub, ...profile }, update: profile });
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'profile.update', entity: 'profile', entityId: updated.id } });
    return updated;
  }
  @Public() @Get() list(@Query('q') q?: string) {
    return this.prisma.user.findMany({ where: q ? { username: { contains: q, mode: 'insensitive' } } : {}, take: 25, select: { id: true, username: true, status: true, reputation: true, profile: true } });
  }
}
