import { ReportStatus, Role } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
declare class RoleDto {
    role: Role;
}
declare class ReportStatusDto {
    status: ReportStatus;
}
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    stats(): Promise<{
        users: number;
        posts: number;
        reports: number;
        communities: number;
    }>;
    users(): import("../generated/prisma").Prisma.PrismaPromise<{
        id: string;
        status: string;
        createdAt: Date;
        email: string;
        username: string;
        role: import("../generated/prisma").$Enums.Role;
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
    reports(): import("../generated/prisma").Prisma.PrismaPromise<({
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
        } | null;
        comment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            postId: string;
            content: string;
            parentId: string | null;
        } | null;
        author: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            passwordHash: string;
            role: import("../generated/prisma").$Enums.Role;
            emailVerifiedAt: Date | null;
            twoFactorSecret: string | null;
            twoFactorEnabled: boolean;
            reputation: number;
            premiumUntil: Date | null;
        };
    } & {
        id: string;
        status: import("../generated/prisma").$Enums.ReportStatus;
        createdAt: Date;
        authorId: string;
        postId: string | null;
        commentId: string | null;
        reason: string;
    })[]>;
    audit(): import("../generated/prisma").Prisma.PrismaPromise<({
        actor: {
            id: string;
            username: string;
            role: import("../generated/prisma").$Enums.Role;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        actorId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        metadata: import("src/generated/prisma/runtime/library").JsonValue;
        ip: string | null;
    })[]>;
    updateRole(admin: any, id: string, dto: RoleDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string;
        passwordHash: string;
        role: import("../generated/prisma").$Enums.Role;
        emailVerifiedAt: Date | null;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        reputation: number;
        premiumUntil: Date | null;
    }>;
    updateReport(admin: any, id: string, dto: ReportStatusDto): Promise<{
        id: string;
        status: import("../generated/prisma").$Enums.ReportStatus;
        createdAt: Date;
        authorId: string;
        postId: string | null;
        commentId: string | null;
        reason: string;
    }>;
}
export {};
