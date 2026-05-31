import { PrismaService } from '../common/prisma/prisma.service';
declare class ReportDto {
    postId?: string;
    commentId?: string;
    reason: string;
}
export declare class ReportsController {
    private prisma;
    constructor(prisma: PrismaService);
    create(user: any, dto: ReportDto): import("src/generated/prisma").Prisma.Prisma__ReportClient<{
        id: string;
        status: import("src/generated/prisma").$Enums.ReportStatus;
        createdAt: Date;
        authorId: string;
        postId: string | null;
        commentId: string | null;
        reason: string;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
}
export {};
