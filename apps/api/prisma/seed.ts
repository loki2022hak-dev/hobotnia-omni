import { PrismaClient, Role } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin12345!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hobotnia.local' },
    update: {},
    create: {
      email: 'admin@hobotnia.local',
      username: 'admin',
      passwordHash,
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
      profile: { create: { bio: 'Адміністратор Хоботні', city: 'Київ' } }
    }
  });

  const categories = [
    ['life', 'Життя'],
    ['relationships', 'Стосунки'],
    ['business', 'Бізнес'],
    ['work', 'Робота'],
    ['self-development', 'Саморозвиток'],
    ['psychology', 'Психологія'],
    ['health', "Здоров'я"],
    ['technology', 'Технології']
  ];
  for (const [slug, title] of categories) {
    await prisma.forumCategory.upsert({ where: { slug }, update: {}, create: { slug, title } });
  }
  await prisma.achievement.upsert({
    where: { code: 'first_story' },
    update: {},
    create: { code: 'first_story', title: 'Перший голос', description: 'Опублікував перший пост у Хоботні.' }
  });
  await prisma.auditLog.create({ data: { actorId: admin.id, action: 'seed', entity: 'system' } });
}

main().finally(() => prisma.$disconnect());
