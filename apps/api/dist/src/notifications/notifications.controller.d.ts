import { PrismaService } from '../common/prisma/prisma.service';
export declare class NotificationsController {
    private prisma;
    constructor(prisma: PrismaService);
    list(user: any): import("src/generated/prisma").Prisma.PrismaPromise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        type: import("src/generated/prisma").$Enums.NotificationType;
        body: string;
        readAt: Date | null;
    }[]>;
    read(user: any, id: string): import("src/generated/prisma").Prisma.PrismaPromise<import("src/generated/prisma").Prisma.BatchPayload>;
    remove(user: any, id: string): import("src/generated/prisma").Prisma.PrismaPromise<import("src/generated/prisma").Prisma.BatchPayload>;
}
