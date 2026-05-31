import { PrismaService } from '../common/prisma/prisma.service';
export declare class SearchController {
    private prisma;
    constructor(prisma: PrismaService);
    search(q?: string): Promise<{
        users: {
            id: string;
            username: string;
            profile: {
                id: string;
                userId: string;
                city: string | null;
                avatarUrl: string | null;
                coverUrl: string | null;
                bio: string | null;
                socialLinks: import("src/generated/prisma/runtime/library").JsonValue;
                stats: import("src/generated/prisma/runtime/library").JsonValue;
            } | null;
        }[];
        posts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("src/generated/prisma").$Enums.PostType;
            authorId: string;
            content: string;
            mediaUrls: string[];
            communityId: string | null;
            repostOfId: string | null;
        }[];
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            postId: string;
            content: string;
            parentId: string | null;
        }[];
        topics: {
            id: string;
            createdAt: Date;
            title: string;
            authorId: string;
            content: string;
            categoryId: string;
        }[];
        communities: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            ownerId: string;
            slug: string;
            visibility: import("src/generated/prisma").$Enums.Visibility;
        }[];
    }>;
}
