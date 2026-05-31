"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const crypto_pay_service_1 = require("./crypto-pay.service");
const billing_plans_1 = require("./billing.plans");
let BillingService = class BillingService {
    prisma;
    cryptoPay;
    notifications;
    constructor(prisma, cryptoPay, notifications) {
        this.prisma = prisma;
        this.cryptoPay = cryptoPay;
        this.notifications = notifications;
    }
    plans() {
        return billing_plans_1.VIP_PLANS;
    }
    async createCheckout(userId, planCode) {
        const plan = (0, billing_plans_1.getVipPlan)(planCode);
        if (!plan)
            throw new common_1.BadRequestException('Unknown VIP plan');
        const payment = await this.prisma.subscriptionPayment.create({
            data: { userId, plan: plan.code, amountUsd: plan.amountUsd, days: plan.days }
        });
        const appUrl = process.env.WEB_ORIGIN ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
        const invoice = await this.cryptoPay.createInvoice({
            amountUsd: plan.amountUsd,
            description: `Хоботня ${plan.title}`,
            payload: JSON.stringify({ paymentId: payment.id, userId, plan: plan.code }),
            paidBtnUrl: `${appUrl}/settings`
        });
        const invoiceUrl = invoice.bot_invoice_url ?? invoice.web_app_invoice_url ?? invoice.mini_app_invoice_url;
        return this.prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: {
                providerInvoiceId: String(invoice.invoice_id),
                invoiceUrl,
                payload: this.json(invoice)
            }
        });
    }
    async myBilling(userId) {
        const [user, payments, subscriptions] = await Promise.all([
            this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { role: true, premiumUntil: true } }),
            this.prisma.subscriptionPayment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
            this.prisma.subscription.findMany({ where: { userId }, orderBy: { startsAt: 'desc' }, take: 10 })
        ]);
        return { user, payments, subscriptions, plans: billing_plans_1.VIP_PLANS };
    }
    async syncInvoice(userId, paymentId) {
        const payment = await this.prisma.subscriptionPayment.findFirst({ where: { id: paymentId, userId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (!payment.providerInvoiceId)
            throw new common_1.BadRequestException('Invoice was not created');
        const invoice = await this.cryptoPay.getInvoice(payment.providerInvoiceId);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found in Crypto Bot');
        if (invoice.status === 'paid')
            return this.activate(payment.id, invoice);
        return this.prisma.subscriptionPayment.update({ where: { id: payment.id }, data: { payload: this.json(invoice) } });
    }
    async handleWebhook(update) {
        if (update?.update_type !== 'invoice_paid')
            return { ok: true };
        const invoice = update.payload;
        const parsed = this.parsePayload(invoice?.payload);
        if (!parsed?.paymentId)
            throw new common_1.BadRequestException('Invoice payload is missing paymentId');
        await this.activate(parsed.paymentId, invoice);
        return { ok: true };
    }
    parsePayload(value) {
        if (!value)
            return undefined;
        try {
            return JSON.parse(value);
        }
        catch {
            throw new common_1.BadRequestException('Invalid invoice payload');
        }
    }
    async activate(paymentId, invoice) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.subscriptionPayment.findUniqueOrThrow({ where: { id: paymentId } });
            if (payment.status === prisma_1.PaymentStatus.PAID)
                return payment;
            const plan = (0, billing_plans_1.getVipPlan)(payment.plan);
            if (!plan)
                throw new common_1.BadRequestException('Unknown VIP plan');
            const user = await tx.user.findUniqueOrThrow({ where: { id: payment.userId }, select: { premiumUntil: true, role: true } });
            const startsAt = user.premiumUntil && user.premiumUntil > new Date() ? user.premiumUntil : new Date();
            const endsAt = new Date(startsAt.getTime() + plan.days * 86400000);
            const paidPayment = await tx.subscriptionPayment.update({
                where: { id: payment.id },
                data: {
                    status: prisma_1.PaymentStatus.PAID,
                    paidAt: new Date(),
                    providerInvoiceId: String(invoice.invoice_id ?? payment.providerInvoiceId),
                    payload: this.json(invoice)
                }
            });
            await tx.subscription.create({ data: { userId: payment.userId, plan: plan.code, status: 'active', startsAt, endsAt } });
            await tx.user.update({ where: { id: payment.userId }, data: { role: user.role === prisma_1.Role.USER ? prisma_1.Role.PREMIUM : user.role, premiumUntil: endsAt } });
            await tx.auditLog.create({ data: { actorId: payment.userId, action: 'billing.vip.activate', entity: 'subscriptionPayment', entityId: payment.id, metadata: { plan: plan.code, endsAt } } });
            await this.notifications.create(payment.userId, prisma_1.NotificationType.SYSTEM, 'VIP активовано', `${plan.title} активний до ${endsAt.toISOString().slice(0, 10)}`);
            return paidPayment;
        });
    }
    json(value) {
        return JSON.parse(JSON.stringify(value));
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, crypto_pay_service_1.CryptoPayService, notifications_service_1.NotificationsService])
], BillingService);
//# sourceMappingURL=billing.service.js.map