import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Обчислюємо часову мітку (24 години тому від поточного моменту)
    const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Шукаємо та оновлюємо всі кімнати, які зависли в режимі очікування
    const affectedRooms = await prisma.room.updateMany({
      where: {
        status: "Очікування",
        createdAt: {
          lt: expirationTime
        }
      },
      data: {
        status: "Скасовано"
      }
    });

    return NextResponse.json({
      status: "success",
      message: "Системне очищення лобі ХОБОТНІ виконано",
      cancelledRoomsCount: affectedRooms.count,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка під час очищення кімнат" }, { status: 500 });
  }
}
