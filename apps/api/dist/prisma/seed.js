"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const bcryptjs_1 = require("bcryptjs");
const prisma = new prisma_1.PrismaClient();
async function main() {
    const passwordHash = await bcryptjs_1.default.hash('Admin12345!', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@hobotnia.local' },
        update: {},
        create: {
            email: 'admin@hobotnia.local',
            username: 'admin',
            passwordHash,
            role: prisma_1.Role.ADMIN,
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
//# sourceMappingURL=seed.js.map