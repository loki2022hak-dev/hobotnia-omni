import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId, itemId, price, statBoost } = await request.json();
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.walletBalance < price) throw new Error("Недостатньо коштів");
      if (user.purchasedItems.includes(itemId)) throw new Error("Предмет уже куплено");

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { decrement: price },
          purchasedItems: { push: itemId },
          // Бустимо стат, який дає деталь
          ...(statBoost.type === 'speed' && { speed: { increment: statBoost.value } }),
          ...(statBoost.type === 'grip' && { grip: { increment: statBoost.value } }),
          ...(statBoost.type === 'nitro' && { nitro: { increment: statBoost.value } }),
        }
      });

      await tx.transaction.create({
        data: {
          userId,
          amount: price,
          type: "WITHDRAWAL",
          status: "SUCCESS",
          txHash: `GARAGE-${itemId}-${Date.now()}`
        }
      });

      return updatedUser;
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
