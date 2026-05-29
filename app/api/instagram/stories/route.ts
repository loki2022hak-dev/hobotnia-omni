import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Повертаємо лише ті сторіс, час дії яких не вичерпано (менше 24 годин)
    const activeStories = await prisma.story.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { nickname: true } } }
    });
    return NextResponse.json(activeStories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, mediaUrl } = await request.json();
    if (!userId || !mediaUrl) return NextResponse.json({ error: "Заповніть медіа" }, { status: 400 });

    const story = await prisma.story.create({
      data: {
        userId,
        mediaUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // рівно на 24 години
      },
      include: { user: { select: { nickname: true } } }
    });
    return NextResponse.json(story);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
