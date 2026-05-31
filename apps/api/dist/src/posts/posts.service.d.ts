import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePostDto, UpdatePostDto } from './dto';
export declare class PostsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    feed(): import("../generated/prisma").Prisma.PrismaPromise<({
        _count: {
            comments: number;
            likes: number;
            reposts: number;
        };
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("../generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    })[]>;
    create(authorId: string, dto: CreatePostDto): import("../generated/prisma").Prisma.Prisma__PostClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("../generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    update(user: any, id: string, dto: UpdatePostDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("../generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("../generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    }>;
    toggleLike(userId: string, postId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        postId: string;
    }>;
    save(userId: string, postId: string): import("../generated/prisma").Prisma.Prisma__SavedPostClient<{
        userId: string;
        createdAt: Date;
        postId: string;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    repost(authorId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("../generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    }>;
}
