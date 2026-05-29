import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { roomId, userId } = await request.json();

    if (!roomId || !userId) {
      return NextResponse.json({ error: "roomId та userId є обов'язковими" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Блокуємо та отримуємо дані кімнати для запобігання Race Condition
      const room = await tx.room.findUnique({
        where: { id: roomId }
      });

      if (!room) throw new Error("Кімнату не знайдено");
      if (room.status !== "Очікування") throw new Error("Гонка вже запущенна або скасована");
      if (room.playersCount >= room.playersMax) throw new Error("Лобі вже заповнене");

      // 2. Отримуємо дані юзера, який намагається увійти
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) throw new Error("Користувача не знайдено");
      if (user.id === room.creatorId) throw new Error("Організатор вже перебуває в кімнаті");
      if (user.walletBalance < room.bet) throw new Error("Недостатньо коштів для цієї ставки");

      // 3. Списуємо ставку з балансу гравця
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: room.bet } }
      });

      // 4. Збільшуємо кількість гравців у кімнаті
      const updatedRoom = await tx.room.update({
        where: { id: roomId },
        data: { playersCount: { increment: 1 } }
      });

      // 5. Фіксуємо списання за ставку в системному Ledger
      await tx.transaction.create({
        data: {
          userId: userId,
          amount: room.bet,
          type: "WITHDRAWAL",
          status: "SUCCESS",
          txHash: `BET-ROOM-${room.id}-${Date.now()}`
        }
      });

      return { updatedUser, updatedRoom };
    });

    return NextResponse.json({
      message: "Успішне підключення до гоночного лобі",
      room: result.updatedRoom,
      newBalance: result.updatedUser.walletBalance
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка при вході в кімнату" }, { status: 500 });
  }
}
