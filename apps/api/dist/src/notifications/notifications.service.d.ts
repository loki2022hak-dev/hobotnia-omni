import { NotificationType } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: NotificationsGateway);
    create(userId: string, type: NotificationType, title: string, body: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        type: import("../generated/prisma").$Enums.NotificationType;
        body: string;
        readAt: Date | null;
    }>;
}
