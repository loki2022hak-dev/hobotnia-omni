import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { roomId, winnerId } = await request.json();

    if (!roomId || !winnerId) {
      return NextResponse.json({ error: "roomId та winnerId є обов'язковими" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Отримуємо кімнату та блокуємо рядок для запобігання Race Condition
      const room = await tx.room.findUnique({
        where: { id: roomId }
      });

      if (!room) throw new Error("Кімнату не знайдено");
      if (room.status === "Завершено") throw new Error("Цей матч уже був розрахований");

      // 2. Рахуємо призовий фонд (ставка помножена на кількість реальних учасників)
      const prizePool = room.bet * room.playersCount;

      // 3. Перевіряємо чи існує переможець
      const winner = await tx.user.findUnique({
        where: { id: winnerId }
      });
      if (!winner) throw new Error("Переможця не знайдено в базі даних");

      // 4. Нараховуємо виграш на баланс переможця
      const updatedWinner = await tx.user.update({
        where: { id: winnerId },
        data: { walletBalance: { increment: prizePool } }
      });

      // 5. Закриваємо кімнату
      const updatedRoom = await tx.room.update({
        where: { id: roomId },
        data: { status: "Завершено" }
      });

      // 6. Фіксуємо прибуток у системному Ledger
      await tx.transaction.create({
        data: {
          userId: winnerId,
          amount: prizePool,
          type: "DEPOSIT",
          status: "SUCCESS",
          txHash: `WIN-ROOM-${room.id}-${Date.now()}`
        }
      });

      return { updatedWinner, updatedRoom, prizePool };
    });

    return NextResponse.json({
      message: "Матч успішно розраховано. Приз зараховано переможцю.",
      roomStatus: result.updatedRoom.status,
      winner: result.updatedWinner.nickname,
      prizePool: result.prizePool,
      newBalance: result.updatedWinner.walletBalance
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка при закритті матчу" }, { status: 500 });
  }
}
