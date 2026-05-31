import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { ReportStatus, Role } from '../generated/prisma';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

class RoleDto { @IsEnum(Role) role!: Role; }
class ReportStatusDto { @IsEnum(ReportStatus) status!: ReportStatus; }

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}
  @Get('stats') async stats() {
    const [users, posts, reports, communities] = await Promise.all([this.prisma.user.count(), this.prisma.post.count(), this.prisma.report.count(), this.prisma.community.count()]);
    return { users, posts, reports, communities };
  }
  @Get('users') users() {
    return this.prisma.user.findMany({
      take: 100,
      select: { id: true, email: true, username: true, role: true, status: true, reputation: true, createdAt: true, profile: true }
    });
  }
  @Get('reports') reports() { return this.prisma.report.findMany({ orderBy: { createdAt: 'desc' }, include: { author: true, post: true, comment: true } }); }
  @Get('audit') audit() { return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { actor: { select: { id: true, username: true, role: true } } } }); }
  @Patch('users/:id/role') async updateRole(@CurrentUser() admin: any, @Param('id') id: string, @Body() dto: RoleDto) {
    const user = await this.prisma.user.update({ where: { id }, data: { role: dto.role } });
    await this.prisma.auditLog.create({ data: { actorId: admin.sub, action: 'admin.user.role.update', entity: 'user', entityId: id, metadata: { role: dto.role } } });
    return user;
  }
  @Patch('reports/:id') async updateReport(@CurrentUser() admin: any, @Param('id') id: string, @Body() dto: ReportStatusDto) {
    const report = await this.prisma.report.update({ where: { id }, data: { status: dto.status } });
    await this.prisma.auditLog.create({ data: { actorId: admin.sub, action: 'admin.report.status.update', entity: 'report', entityId: id, metadata: { status: dto.status } } });
    return report;
  }
}
