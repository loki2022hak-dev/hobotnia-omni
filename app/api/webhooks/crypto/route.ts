import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// POST: Обробка автоматичного поповнення балансу через крипто-транзакції
export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-crypto-signature");
    const bodyText = await request.text();
    
    // Перевірка підпису мерчанта для безпеки (якщо активований ліміт в .env)
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

    // Валідуємо тільки успішно закриті мережею транзакції
    if (status !== "success" || !userId || !amount) {
      return NextResponse.json({ message: "Транзакція проігнорована (немає успішного статусу)" }, { status: 200 });
    }

    // Нараховуємо кошти на баланс ХОБОТА в базі даних
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: parseFloat(amount)
        }
      }
    });

    return NextResponse.json({
      status: "verified",
      transactionId: transactionId,
      newBalance: updatedUser.balance
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка обробки крипто-вебхуку" }, { status: 500 });
  }
}
