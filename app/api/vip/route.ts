import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user-id";

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        walletBalance: true,
        isVip: true,
        vipPlan: true,
        speed: true,
        grip: true,
        nitro: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    return NextResponse.json({
      user,
      vipStatus: user.isVip ? (user.vipPlan || "GOLD") : "FREE"
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, speed, grip, nitro } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId обов'язковий" }, { status: 400 });
    }

    if (speed + grip + nitro > 100) {
      return NextResponse.json({ error: "Сума очок не може перевищувати 100" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { speed, grip, nitro }
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
