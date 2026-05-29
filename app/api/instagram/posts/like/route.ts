import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }
    });
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
