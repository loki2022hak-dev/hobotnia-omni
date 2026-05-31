import { CreatePostDto, UpdatePostDto } from './dto';
import { PostsService } from './posts.service';
export declare class PostsController {
    private posts;
    constructor(posts: PostsService);
    feed(): import("src/generated/prisma").Prisma.PrismaPromise<({
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
        type: import("src/generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    })[]>;
    create(user: any, dto: CreatePostDto): import("src/generated/prisma").Prisma.Prisma__PostClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("src/generated/prisma").$Enums.PostType;
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
        type: import("src/generated/prisma").$Enums.PostType;
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
        type: import("src/generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    }>;
    like(user: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        postId: string;
    }>;
    save(user: any, id: string): import("src/generated/prisma").Prisma.Prisma__SavedPostClient<{
        userId: string;
        createdAt: Date;
        postId: string;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    repost(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("src/generated/prisma").$Enums.PostType;
        authorId: string;
        content: string;
        mediaUrls: string[];
        communityId: string | null;
        repostOfId: string | null;
    }>;
}
