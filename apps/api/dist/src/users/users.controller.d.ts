import { PrismaService } from '../common/prisma/prisma.service';
declare class UpdateProfileDto {
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    city?: string;
    status?: string;
    socialLinks?: Record<string, string>;
}
export declare class UsersController {
    private prisma;
    constructor(prisma: PrismaService);
    me(user: any): import("src/generated/prisma").Prisma.Prisma__UserClient<({
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
        achievements: ({
            achievement: {
                id: string;
                description: string;
                title: string;
                code: string;
            };
        } & {
            userId: string;
            achievementId: string;
            awardedAt: Date;
        })[];
        _count: {
            posts: number;
            comments: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string;
        passwordHash: string;
        role: import("src/generated/prisma").$Enums.Role;
        emailVerifiedAt: Date | null;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        reputation: number;
        premiumUntil: Date | null;
    }) | null, null, import("src/generated/prisma/runtime/library").DefaultArgs>;
    updateMe(user: any, dto: UpdateProfileDto): Promise<{
        id: string;
        userId: string;
        city: string | null;
        avatarUrl: string | null;
        coverUrl: string | null;
        bio: string | null;
        socialLinks: import("src/generated/prisma/runtime/library").JsonValue;
        stats: import("src/generated/prisma/runtime/library").JsonValue;
    }>;
    list(q?: string): import("src/generated/prisma").Prisma.PrismaPromise<{
        id: string;
        status: string;
        username: string;
        reputation: number;
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
    }[]>;
}
export {};
