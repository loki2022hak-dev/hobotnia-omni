import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SERVERSIDE_GARAGE_ITEMS } from "../config/items";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, itemId } = await request.json();

    if (!userId || !itemId) {
      return NextResponse.json({ error: "Невалідні параметри запиту" }, { status: 400 });
    }

    // Захист: беремо дані про ціну виключно з константи сервера, ігноруючи клієнт
    const serverItem = SERVERSIDE_GARAGE_ITEMS[itemId];
    if (!serverItem) {
      return NextResponse.json({ error: "Такого ніштяка не існує в каталозі" }, { status: 400 });
    }

    const { price, stat, value } = serverItem;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Користувача не знайдено");
      if (user.walletBalance < price) throw new Error("Недостатньо кешу на балансі ХОБОТНІ");
      if (user.purchasedItems.includes(itemId)) throw new Error("Цей апгрейд уже встановлено на твою тачку");

      // Динамічно оновлюємо потрібну характеристику
      const updateData: any = {
        walletBalance: { decrement: price },
        purchasedItems: { push: itemId }
      };

      if (stat === "speed") updateData.speed = { increment: value };
      if (stat === "grip") updateData.grip = { increment: value };
      if (stat === "nitro") updateData.nitro = { increment: value };

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updateData
      });

      // Фіксуємо транзакцію в Ledger
      await tx.transaction.create({
        data: {
          userId,
          amount: price,
          type: "WITHDRAWAL",
          status: "SUCCESS",
          txHash: `GARAGE-BUY-${itemId}-${Date.now()}`
        }
      });

      return updatedUser;
    });

    return NextResponse.json({ success: true, user: result }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка транзакції гаражу" }, { status: 500 });
  }
}
