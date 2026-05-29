import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get("excludeId") || "";

    // Повертаємо список усіх, крім себе, щоб було кому писати
    const users = await prisma.user.findMany({
      where: { NOT: { id: currentUserId } },
      select: { id: true, nickname: true, isVip: true }
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
