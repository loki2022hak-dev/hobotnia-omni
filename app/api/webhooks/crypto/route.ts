import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-crypto-signature");
    const bodyText = await request.text();
    
    const secret = process.env.CRYPTO_WEBHOOK_SECRET;
    if (secret && signature) {
      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(bodyText)
        .digest("hex");
        
      if (computedSignature !== signature) {
        return NextResponse.json({ error: "Невалідний підпис транзакції" }, { status: 401 });
      }
    }

    const payload = JSON.parse(bodyText);
    const { userId, amount, status, transactionId } = payload;

    if (status !== "success" || !userId || !amount) {
      return NextResponse.json({ message: "Транзакція проігнорована" }, { status: 200 });
    }

    // Запускаємо транзакцію: оновлюємо баланс ТА створюємо лог транзакції одночасно
    const result = await prisma.$transaction(async (tx) => {
      // Перевіряємо чи транзакція вже не була оброблена раніше (захист від Double-Spending)
      const existingTx = await tx.transaction.findUnique({
        where: { txHash: transactionId }
      });

      if (existingTx) {
        throw new Error("Ця транзакція вже була оброблена");
      }

      // 1. Нараховуємо баланс
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: parseFloat(amount) } }
      });

      // 2. Створюємо запис в історії
      await tx.transaction.create({
        data: {
          userId: userId,
          amount: parseFloat(amount),
          type: "DEPOSIT",
          status: "SUCCESS",
          txHash: transactionId
        }
      });

      return updatedUser;
    });

    return NextResponse.json({
      status: "verified",
      transactionId: transactionId,
      newBalance: result.walletBalance
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Помилка обробки крипто-вебхуку" }, { status: 500 });
  }
}
