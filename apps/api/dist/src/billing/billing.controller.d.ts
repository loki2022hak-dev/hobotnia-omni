import { BillingService } from './billing.service';
import { CryptoPayService } from './crypto-pay.service';
declare class CheckoutDto {
    plan: string;
}
export declare class BillingController {
    private billing;
    private cryptoPay;
    constructor(billing: BillingService, cryptoPay: CryptoPayService);
    plans(): import("./billing.plans").VipPlan[];
    me(user: any): Promise<{
        user: {
            role: import("src/generated/prisma").$Enums.Role;
            premiumUntil: Date | null;
        };
        payments: {
            id: string;
            status: import("src/generated/prisma").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: string;
            amountUsd: number;
            days: number;
            provider: string;
            providerInvoiceId: string | null;
            invoiceUrl: string | null;
            payload: import("src/generated/prisma/runtime/library").JsonValue;
            paidAt: Date | null;
        }[];
        subscriptions: {
            id: string;
            status: string;
            userId: string;
            plan: string;
            startsAt: Date;
            endsAt: Date;
        }[];
        plans: import("./billing.plans").VipPlan[];
    }>;
    checkout(user: any, dto: CheckoutDto): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        plan: string;
        amountUsd: number;
        days: number;
        provider: string;
        providerInvoiceId: string | null;
        invoiceUrl: string | null;
        payload: import("src/generated/prisma/runtime/library").JsonValue;
        paidAt: Date | null;
    }>;
    sync(user: any, id: string): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        plan: string;
        amountUsd: number;
        days: number;
        provider: string;
        providerInvoiceId: string | null;
        invoiceUrl: string | null;
        payload: import("src/generated/prisma/runtime/library").JsonValue;
        paidAt: Date | null;
    }>;
    webhook(secret: string, body: unknown, signature?: string): Promise<{
        ok: boolean;
    }>;
}
export {};
