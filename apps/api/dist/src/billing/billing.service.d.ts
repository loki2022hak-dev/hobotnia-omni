import { Prisma } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CryptoPayService } from './crypto-pay.service';
export declare class BillingService {
    private prisma;
    private cryptoPay;
    private notifications;
    constructor(prisma: PrismaService, cryptoPay: CryptoPayService, notifications: NotificationsService);
    plans(): import("./billing.plans").VipPlan[];
    createCheckout(userId: string, planCode: string): Promise<{
        id: string;
        userId: string;
        plan: string;
        amountUsd: number;
        days: number;
        provider: string;
        providerInvoiceId: string | null;
        invoiceUrl: string | null;
        status: import("../generated/prisma").$Enums.PaymentStatus;
        payload: Prisma.JsonValue;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    myBilling(userId: string): Promise<{
        user: {
            role: import("../generated/prisma").$Enums.Role;
            premiumUntil: Date | null;
        };
        payments: {
            id: string;
            userId: string;
            plan: string;
            amountUsd: number;
            days: number;
            provider: string;
            providerInvoiceId: string | null;
            invoiceUrl: string | null;
            status: import("../generated/prisma").$Enums.PaymentStatus;
            payload: Prisma.JsonValue;
            paidAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        subscriptions: {
            id: string;
            userId: string;
            plan: string;
            status: string;
            startsAt: Date;
            endsAt: Date;
        }[];
        plans: import("./billing.plans").VipPlan[];
    }>;
    syncInvoice(userId: string, paymentId: string): Promise<{
        id: string;
        userId: string;
        plan: string;
        amountUsd: number;
        days: number;
        provider: string;
        providerInvoiceId: string | null;
        invoiceUrl: string | null;
        status: import("../generated/prisma").$Enums.PaymentStatus;
        payload: Prisma.JsonValue;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    handleWebhook(update: any): Promise<{
        ok: boolean;
    }>;
    private parsePayload;
    private activate;
    private json;
}
