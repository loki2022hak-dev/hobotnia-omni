import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JobType, Role } from '../generated/prisma';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
class JobDto { @IsString() company!: string; @IsString() title!: string; @IsString() @MinLength(20) description!: string; @IsOptional() @IsString() city?: string; @IsEnum(JobType) type!: JobType; }
class ApplyDto { @IsOptional() @IsString() resumeUrl?: string; @IsOptional() @IsString() coverText?: string; }
@Controller('jobs')
export class JobsController {
  constructor(private prisma: PrismaService) {}
  @Public() @Get() list() { return this.prisma.jobPost.findMany({ orderBy: { createdAt: 'desc' } }); }
  @Roles(Role.ADMIN, Role.MODERATOR, Role.PREMIUM) @Post() create(@CurrentUser() user: any, @Body() dto: JobDto) {
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.jobPost.create({ data: dto });
      await tx.auditLog.create({ data: { actorId: user.sub, action: 'job.create', entity: 'jobPost', entityId: job.id } });
      return job;
    });
  }
  @Post(':id/apply') apply(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: ApplyDto) { return this.prisma.jobApplication.create({ data: { jobId: id, userId: user.sub, ...dto } }); }
  @Roles(Role.ADMIN, Role.MODERATOR) @Patch(':id') async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: JobDto) {
    const job = await this.prisma.jobPost.update({ where: { id }, data: dto });
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'job.update', entity: 'jobPost', entityId: id } });
    return job;
  }
  @Roles(Role.ADMIN, Role.MODERATOR) @Delete(':id') async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const job = await this.prisma.jobPost.delete({ where: { id } });
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'job.delete', entity: 'jobPost', entityId: id } });
    return job;
  }
}
