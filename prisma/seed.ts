import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultUserId = "default-user-id";

  // Upsert гарантує: якщо юзер є — його не дублює, якщо немає — створює з нуля
  const user = await prisma.user.upsert({
    where: { id: defaultUserId },
    update: {},
    create: {
      id: defaultUserId,
      username: "ХОБОТ",
      balance: 12450.00,
      speed: 40,
      grip: 30,
      nitro: 30,
    },
  });

  console.log(`[SEED] База даних успішно ініціалізована. Дефолтний юзер: ${user.username}`);
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
