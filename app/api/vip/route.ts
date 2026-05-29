import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Перевірка VIP-статусу користувача та його конфігурації
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Параметр userId обов'язковий" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        balance: true,
        speed: true,
        grip: true,
        nitro: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    // Повертаємо профіль з VIP-метриками (0% комісії, як на фронтенді)
    return NextResponse.json({
      status: "success",
      vipStatus: "GOLD",
      serviceFee: 0,
      configMaxPoints: 100,
      user: user
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

// POST: Оновлення кастомного пресету характеристик (Speed, Grip, Nitro <= 100)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, speed, grip, nitro } = body;

    if (!userId || speed === undefined || grip === undefined || nitro === undefined) {
      return NextResponse.json({ error: "Відсутні обов'язкові параметри конфігу" }, { status: 400 });
    }

    const totalPoints = speed + grip + nitro;
    if (totalPoints > 100) {
      return NextResponse.json({ error: "Перевищено ліміт точок конфігурації (Макс: 100)" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        speed: parseInt(speed),
        grip: parseInt(grip),
        nitro: parseInt(nitro)
      }
    });

    return NextResponse.json({
      status: "success",
      message: "Пресет VIP успішно синхронізовано",
      stats: {
        speed: updatedUser.speed,
        grip: updatedUser.grip,
        nitro: updatedUser.nitro
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Не вдалося оновити VIP конфіг" }, { status: 500 });
  }
}
