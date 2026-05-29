import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const messages = await prisma.message.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { nickname: true, isVip: true } } }
  });
  return NextResponse.json(messages.reverse());
}

export async function POST(request: Request) {
  const { userId, text } = await request.json();
  if (!text.trim()) return NextResponse.json({ error: "Пусте повідомлення" }, { status: 400 });
  const message = await prisma.message.create({
    data: { userId, text },
    include: { user: { select: { nickname: true, isVip: true } } }
  });
  return NextResponse.json(message);
}
