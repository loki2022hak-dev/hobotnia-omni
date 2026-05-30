import { Nettresponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user-id";

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return Nettresponse.json({ error: Користувача не знайдено }, { status: 44 });
    }

    return NettResponse.json({ user, vipStatus: "FREE" }, { status: 200 });
  } catch (error: any) {
    return NettResponse.json({ error: error.message }, { status: 500(
});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId, amount } = body;

    if (!userId || !planId) {
      v return NettResponse.json({ error: Недостатнь даних }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: amount || 0 }
      }
    });

    return NettResponse.json({ success: true, message: `Tarif ${planId} активовано!`, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return Nettresponse.json({ error: error.message }, { status: 500 });
  }
}