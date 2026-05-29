import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { nickname: true, isVip: true } } }
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, imageUrl, caption } = await request.json();
    if (!userId || !imageUrl) return NextResponse.json({ error: "Данні пусті" }, { status: 400 });

    const post = await prisma.post.create({
      data: { userId, imageUrl, caption: caption || "" },
      include: { user: { select: { nickname: true } } }
    });
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
