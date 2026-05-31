import { PrismaClient } from '../apps/api/src/generated/prisma';

const prisma = new PrismaClient();

const categories = [
  ['life', 'Життя', 'Особисті історії, втрати, зміни та відновлення'],
  ['relationships', 'Стосунки', 'Сімейні, дружні та романтичні стосунки'],
  ['business', 'Бізнес', 'Підприємництво, партнерства та гроші'],
  ['work', 'Робота', 'Карʼєра, команди, найм і професійні зміни'],
  ['self-development', 'Саморозвиток', 'Звички, навчання, дисципліна та цілі'],
  ['psychology', 'Психологія', 'Психічне здоровʼя, терапія та підтримка'],
  ['health', 'Здоровʼя', 'Фізичне здоровʼя, відновлення та турбота про себе'],
  ['technology', 'Технології', 'Інструменти, цифрові продукти та технічний досвід']
] as const;

const achievements = [
  ['first_post', 'Перший допис', 'Користувач опублікував перший допис'],
  ['first_comment', 'Перший коментар', 'Користувач долучився до обговорення'],
  ['community_builder', 'Будівничий спільноти', 'Користувач створив спільноту']
] as const;

async function main() {
  for (const [slug, title, description] of categories) {
    await prisma.forumCategory.upsert({
      where: { slug },
      update: { title, description },
      create: { slug, title, description }
    });
  }

  for (const [code, title, description] of achievements) {
    await prisma.achievement.upsert({
      where: { code },
      update: { title, description },
      create: { code, title, description }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
