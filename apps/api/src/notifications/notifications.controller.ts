import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
@Controller('notifications')
export class NotificationsController {
  constructor(private prisma: PrismaService) {}
  @Get() list(@CurrentUser() user: any) { return this.prisma.notification.findMany({ where: { userId: user.sub }, orderBy: { createdAt: 'desc' }, take: 50 }); }
  @Patch(':id/read') read(@CurrentUser() user: any, @Param('id') id: string) { return this.prisma.notification.updateMany({ where: { id, userId: user.sub }, data: { readAt: new Date() } }); }
  @Delete(':id') remove(@CurrentUser() user: any, @Param('id') id: string) { return this.prisma.notification.deleteMany({ where: { id, userId: user.sub } }); }
}
