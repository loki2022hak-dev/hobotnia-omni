import { JobType } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
declare class JobDto {
    company: string;
    title: string;
    description: string;
    city?: string;
    type: JobType;
}
declare class ApplyDto {
    resumeUrl?: string;
    coverText?: string;
}
export declare class JobsController {
    private prisma;
    constructor(prisma: PrismaService);
    list(): import("../generated/prisma").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        description: string;
        title: string;
        company: string;
        city: string | null;
        type: import("../generated/prisma").$Enums.JobType;
    }[]>;
    create(user: any, dto: JobDto): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        title: string;
        company: string;
        city: string | null;
        type: import("../generated/prisma").$Enums.JobType;
    }>;
    apply(user: any, id: string, dto: ApplyDto): import("../generated/prisma").Prisma.Prisma__JobApplicationClient<{
        id: string;
        userId: string;
        createdAt: Date;
        jobId: string;
        resumeUrl: string | null;
        coverText: string | null;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    update(user: any, id: string, dto: JobDto): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        title: string;
        company: string;
        city: string | null;
        type: import("../generated/prisma").$Enums.JobType;
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        title: string;
        company: string;
        city: string | null;
        type: import("../generated/prisma").$Enums.JobType;
    }>;
}
export {};
