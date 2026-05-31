import { PrismaService } from '../common/prisma/prisma.service';
declare class TopicDto {
    title: string;
    content: string;
}
export declare class ForumController {
    private prisma;
    constructor(prisma: PrismaService);
    categories(): import("src/generated/prisma").Prisma.PrismaPromise<({
        _count: {
            topics: number;
        };
    } & {
        id: string;
        description: string | null;
        title: string;
        slug: string;
    })[]>;
    topics(slug: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        authorId: string;
        content: string;
        categoryId: string;
    }[]>;
    create(user: any, slug: string, dto: TopicDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        authorId: string;
        content: string;
        categoryId: string;
    }>;
}
export {};
