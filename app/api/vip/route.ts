import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user-id";

    // Шукаємо юзера в базі
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vip: true } // Якщо є пов'язана модель VIP
    });

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    // Повертаємо чистий преміум-стейт
    return NextResponse.json({
      user,
      vipStatus: user.vip?.isActive ? "GOLD" : "FREE"
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId, amount } = body;

    if (!userId || !planId) {
      return NextResponse.json({ error: "Недостатньо даних для транзакції" }, { status: 400 });
    }

    // Проста логіка активації (можна розширити під твою схему Prisma)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: amount || 0 },
        // Припускаємо наявність прапорця або зв'язку
        isVip: true 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Тариф ${planId} активовано успішно!`,
      user: updatedUser
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
