import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType, PaymentStatus, Prisma, Role } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CryptoPayService } from './crypto-pay.service';
import { getVipPlan, VIP_PLANS } from './billing.plans';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService, private cryptoPay: CryptoPayService, private notifications: NotificationsService) {}

  plans() {
    return VIP_PLANS;
  }

  async createCheckout(userId: string, planCode: string) {
    const plan = getVipPlan(planCode);
    if (!plan) throw new BadRequestException('Unknown VIP plan');
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

  async myBilling(userId: string) {
    const [user, payments, subscriptions] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { role: true, premiumUntil: true } }),
      this.prisma.subscriptionPayment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.subscription.findMany({ where: { userId }, orderBy: { startsAt: 'desc' }, take: 10 })
    ]);
    return { user, payments, subscriptions, plans: VIP_PLANS };
  }

  async syncInvoice(userId: string, paymentId: string) {
    const payment = await this.prisma.subscriptionPayment.findFirst({ where: { id: paymentId, userId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (!payment.providerInvoiceId) throw new BadRequestException('Invoice was not created');
    const invoice = await this.cryptoPay.getInvoice(payment.providerInvoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found in Crypto Bot');
    if (invoice.status === 'paid') return this.activate(payment.id, invoice);
    return this.prisma.subscriptionPayment.update({ where: { id: payment.id }, data: { payload: this.json(invoice) } });
  }

  async handleWebhook(update: any) {
    if (update?.update_type !== 'invoice_paid') return { ok: true };
    const invoice = update.payload;
    const parsed = this.parsePayload(invoice?.payload);
    if (!parsed?.paymentId) throw new BadRequestException('Invoice payload is missing paymentId');
    await this.activate(parsed.paymentId, invoice);
    return { ok: true };
  }

  private parsePayload(value?: string) {
    if (!value) return undefined;
    try {
      return JSON.parse(value) as { paymentId?: string; userId?: string; plan?: string };
    } catch {
      throw new BadRequestException('Invalid invoice payload');
    }
  }

  private async activate(paymentId: string, invoice: any) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.subscriptionPayment.findUniqueOrThrow({ where: { id: paymentId } });
      if (payment.status === PaymentStatus.PAID) return payment;
      const plan = getVipPlan(payment.plan);
      if (!plan) throw new BadRequestException('Unknown VIP plan');
      const user = await tx.user.findUniqueOrThrow({ where: { id: payment.userId }, select: { premiumUntil: true, role: true } });
      const startsAt = user.premiumUntil && user.premiumUntil > new Date() ? user.premiumUntil : new Date();
      const endsAt = new Date(startsAt.getTime() + plan.days * 86400000);
      const paidPayment = await tx.subscriptionPayment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          providerInvoiceId: String(invoice.invoice_id ?? payment.providerInvoiceId),
          payload: this.json(invoice)
        }
      });
      await tx.subscription.create({ data: { userId: payment.userId, plan: plan.code, status: 'active', startsAt, endsAt } });
      await tx.user.update({ where: { id: payment.userId }, data: { role: user.role === Role.USER ? Role.PREMIUM : user.role, premiumUntil: endsAt } });
      await tx.auditLog.create({ data: { actorId: payment.userId, action: 'billing.vip.activate', entity: 'subscriptionPayment', entityId: payment.id, metadata: { plan: plan.code, endsAt } } });
      await this.notifications.create(payment.userId, NotificationType.SYSTEM, 'VIP активовано', `${plan.title} активний до ${endsAt.toISOString().slice(0, 10)}`);
      return paidPayment;
    });
  }

  private json(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
