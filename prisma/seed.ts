import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultUserId = "default-user-id";

  // Використовуємо реальні поля: nickname, walletBalance, isVip тощо
  const user = await prisma.user.upsert({
    where: { id: defaultUserId },
    update: {},
    create: {
      id: defaultUserId,
      nickname: "ХОБОТ",
      walletBalance: 12450.00,
      isVip: true,
      vipPlan: "GOLD",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
    },
  });

  console.log(`[SEED] База даних успішно ініціалізована. Дефолтний юзер: ${user.nickname}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
