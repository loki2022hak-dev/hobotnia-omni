import { Injectable } from '@nestjs/common';
import { NotificationType } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private gateway: NotificationsGateway) {}

  async create(userId: string, type: NotificationType, title: string, body: string) {
    const notification = await this.prisma.notification.create({ data: { userId, type, title, body } });
    this.gateway.emitToUser(userId, notification);
    return notification;
  }
}
