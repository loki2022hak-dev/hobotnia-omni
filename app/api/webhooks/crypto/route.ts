import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN || '';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('crypto-pay-api-signature');
    
    const secret = crypto.createHash('sha256').update(CRYPTO_BOT_TOKEN).digest();
    const hash = crypto.createHmac('sha256', secret).update(bodyText).digest('hex');
    
    if (hash !== signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });

    const update = JSON.parse(bodyText);
    
    if (update.update_type === 'invoice_paid') {
      const invoice = update.payload;
      const [userId, plan] = invoice.payload.split('_');

      let daysToAdd = 30;
      if (plan === 'SEASON') daysToAdd = 90;
      if (plan === 'LEGEND') daysToAdd = 365;
      if (plan === 'FOUNDER') daysToAdd = 36500;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);

      await prisma.user.update({
        where: { id: userId },
        data: { isVip: true, vipPlan: plan, vipExpiresAt: expiresAt }
      });

      await prisma.invoice.update({
        where: { invoiceId: invoice.invoice_id.toString() },
        data: { status: 'paid' }
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
