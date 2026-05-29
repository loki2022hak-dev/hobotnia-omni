import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Отримати історію діалогу між двома користувачами
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const contactId = searchParams.get("contactId");

    if (!userId || !contactId) {
      return NextResponse.json({ error: "Недостатньо параметрів" }, { status: 400 });
    }

    const dms = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { nickname: true } },
        receiver: { select: { nickname: true } }
      }
    });

    return NextResponse.json(dms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Надіслати приватне повідомлення хоботу
export async function POST(request: Request) {
  try {
    const { senderId, receiverId, text } = await request.json();

    if (!text || !text.trim() || !senderId || !receiverId) {
      return NextResponse.json({ error: "Валідація провалена" }, { status: 400 });
    }

    if (text.length > 300) {
      return NextResponse.json({ error: "Занадто довга шифровка (макс 300 символів)" }, { status: 400 });
    }

    const newDm = await prisma.directMessage.create({
      data: {
        senderId,
        receiverId,
        text: text.trim()
      },
      include: {
        sender: { select: { nickname: true } }
      }
    });

    return NextResponse.json(newDm);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
