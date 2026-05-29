import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // В майбутньому тут буде перевірка сесії адміна (наразі відкритий захищений пулл)
    
    // 1. Агрегуємо загальні суми депозитів та списань (всі SUCCESS операції)
    const financialStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: { status: "SUCCESS" },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // 2. Рахуємо загальну кількість користувачів та сумарний баланс, що зараз на руках (зобов'язання системи)
    const userStats = await prisma.user.aggregate({
      _sum: {
        walletBalance: true
      },
      _count: {
        id: true
      }
    });

    // 3. Рахуємо статистику по інвойсах (очікують оплати чи вже закриті)
    const invoiceStats = await prisma.invoice.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    // Форматуємо масив групування у зручний плоский об'єкт
    const deposits = financialStats.find(f => f.type === "DEPOSIT");
    const withdrawals = financialStats.find(f => f.type === "WITHDRAWAL");

    const totalDeposited = deposits?._sum?.amount || 0;
    const totalWithdrawn = withdrawals?._sum?.amount || 0;
    
    // Чистий профіт системи (якщо є комісії або утримання з банку кімнат)
    const systemGains = totalDeposited - totalWithdrawn - (userStats._sum.walletBalance || 0);

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      metrics: {
        finance: {
          totalDeposited,
          depositCount: deposits?._count?.id || 0,
          totalWithdrawn,
          withdrawalCount: withdrawals?._count?.id || 0,
          systemGains: parseFloat(systemGains.toFixed(2))
        },
        users: {
          totalPlayers: userStats._count.id,
          totalCirculatingBalance: userStats._sum.walletBalance || 0
        },
        invoices: invoiceStats.map(i => ({
          status: i.status,
          count: i._count.id,
          totalAmount: i._sum.amount || 0
        }))
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка генерації адмін-аналітики" }, { status: 500 });
  }
}
