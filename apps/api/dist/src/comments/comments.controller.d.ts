import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
declare class CreateCommentDto {
    content: string;
    parentId?: string;
}
export declare class CommentsController {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    list(postId: string): import("../generated/prisma").Prisma.PrismaPromise<({
        author: {
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
        };
        replies: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            postId: string;
            content: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        postId: string;
        content: string;
        parentId: string | null;
    })[]>;
    create(user: any, postId: string, dto: CreateCommentDto): Promise<{
        post: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("../generated/prisma").$Enums.PostType;
            authorId: string;
            content: string;
            mediaUrls: string[];
            communityId: string | null;
            repostOfId: string | null;
        };
        author: {
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        postId: string;
        content: string;
        parentId: string | null;
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        postId: string;
        content: string;
        parentId: string | null;
    }>;
}
export {};
