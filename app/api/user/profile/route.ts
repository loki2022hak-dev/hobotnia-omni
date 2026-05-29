import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user-id";

    // Отримуємо юзера разом із його транзакціями та інвойсами за один крок (Eager Loading)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10 // Беремо тільки останні 10 операцій для оптимізації трафіку
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено в системі ХОБОТНІ" }, { status: 404 });
    }

    // Розраховуємо динамічні метрики (наприклад, чи не закінчився VIP)
    const isVipActive = user.isVip && (!user.vipExpiresAt || new Date(user.vipExpiresAt) > new Date());

    return NextResponse.json({
      status: "success",
      profile: {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        balance: user.walletBalance,
        vip: {
          isActive: isVipActive,
          plan: user.vipPlan || "FREE",
          expiresAt: user.vipExpiresAt
        },
        stats: {
          speed: user.speed,
          grip: user.grip,
          nitro: user.nitro
        },
        history: {
          transactions: user.transactions,
          invoices: user.invoices
        }
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка завантаження профілю" }, { status: 500 });
  }
}
