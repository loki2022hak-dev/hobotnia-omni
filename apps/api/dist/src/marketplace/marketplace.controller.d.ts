import { PrismaService } from '../common/prisma/prisma.service';
declare class ItemDto {
    title: string;
    description: string;
    price: number;
    category: string;
    photoUrls?: string[];
}
export declare class MarketplaceController {
    private prisma;
    constructor(prisma: PrismaService);
    list(q?: string, category?: string): import("../generated/prisma").Prisma.PrismaPromise<{
        id: string;
        status: import("../generated/prisma").$Enums.MarketplaceStatus;
        createdAt: Date;
        description: string;
        sellerId: string;
        title: string;
        price: import("src/generated/prisma/runtime/library").Decimal;
        category: string;
        photoUrls: string[];
    }[]>;
    create(user: any, dto: ItemDto): import("../generated/prisma").Prisma.Prisma__MarketplaceItemClient<{
        id: string;
        status: import("../generated/prisma").$Enums.MarketplaceStatus;
        createdAt: Date;
        description: string;
        sellerId: string;
        title: string;
        price: import("src/generated/prisma/runtime/library").Decimal;
        category: string;
        photoUrls: string[];
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    update(user: any, id: string, dto: ItemDto): Promise<{
        id: string;
        status: import("../generated/prisma").$Enums.MarketplaceStatus;
        createdAt: Date;
        description: string;
        sellerId: string;
        title: string;
        price: import("src/generated/prisma/runtime/library").Decimal;
        category: string;
        photoUrls: string[];
    }>;
    markSold(user: any, id: string): Promise<{
        id: string;
        status: import("../generated/prisma").$Enums.MarketplaceStatus;
        createdAt: Date;
        description: string;
        sellerId: string;
        title: string;
        price: import("src/generated/prisma/runtime/library").Decimal;
        category: string;
        photoUrls: string[];
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        status: import("../generated/prisma").$Enums.MarketplaceStatus;
        createdAt: Date;
        description: string;
        sellerId: string;
        title: string;
        price: import("src/generated/prisma/runtime/library").Decimal;
        category: string;
        photoUrls: string[];
    }>;
}
export {};
