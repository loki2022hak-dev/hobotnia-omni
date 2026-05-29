import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const messages = await prisma.message.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { nickname: true, isVip: true } } }
  });
  return NextResponse.json(messages.reverse());
}

export async function POST(request: Request) {
  try {
    const { userId, text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Повідомлення не може бути пустим" }, { status: 400 });
    }

    if (text.length > 200) {
      return NextResponse.json({ error: "Занадто багато хоботу (ліміт 200 символів)" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { userId, text: text.trim() },
      include: { user: { select: { nickname: true, isVip: true } } }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
