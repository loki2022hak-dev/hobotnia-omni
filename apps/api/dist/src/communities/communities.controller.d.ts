import { Visibility } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
declare class CreateCommunityDto {
    name: string;
    slug: string;
    description?: string;
    visibility?: Visibility;
}
export declare class CommunitiesController {
    private prisma;
    constructor(prisma: PrismaService);
    list(): import("../generated/prisma").Prisma.PrismaPromise<({
        _count: {
            posts: number;
            members: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        ownerId: string;
        slug: string;
        visibility: import("../generated/prisma").$Enums.Visibility;
    })[]>;
    create(user: any, dto: CreateCommunityDto): import("../generated/prisma").Prisma.Prisma__CommunityClient<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        ownerId: string;
        slug: string;
        visibility: import("../generated/prisma").$Enums.Visibility;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    join(user: any, id: string): import("../generated/prisma").Prisma.Prisma__CommunityMemberClient<{
        userId: string;
        role: import("../generated/prisma").$Enums.Role;
        communityId: string;
        joinedAt: Date;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    update(user: any, id: string, dto: CreateCommunityDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        ownerId: string;
        slug: string;
        visibility: import("../generated/prisma").$Enums.Visibility;
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        ownerId: string;
        slug: string;
        visibility: import("../generated/prisma").$Enums.Visibility;
    }>;
}
export {};
