import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN || '';

export async function POST(req: Request) {
  try {
    const { userId, plan, amount } = await req.json();
    const response = await fetch('https://pay.crypt.bot/api/createInvoice', {
      method: 'POST',
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asset: 'USDT',
        amount: amount.toString(),
        description: `Оплата VIP статусу [${plan}] на Хоботні`,
        hidden_message: 'Ласкаво просимо до VIP Клубу! Твій статус активовано.',
        payload: `${userId}_${plan}`,
      }),
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.error.name);

    await prisma.invoice.create({
      data: {
        userId,
        invoiceId: data.result.invoice_id.toString(),
        amount: parseFloat(amount),
        plan,
      }
    });

    return NextResponse.json({ payUrl: data.result.pay_url });
  } catch (error) {
    return NextResponse.json({ error: 'Помилка створення оплати' }, { status: 500 });
  }
}
