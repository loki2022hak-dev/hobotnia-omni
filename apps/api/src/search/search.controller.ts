import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
@Controller('search')
export class SearchController {
  constructor(private prisma: PrismaService) {}
  @Public() @Get()
  async search(@Query('q') q = '') {
    const text = q.trim();
    if (!text) return { users: [], posts: [], comments: [], topics: [], communities: [] };
    const [users, posts, comments, topics, communities] = await Promise.all([
      this.prisma.user.findMany({ where: { username: { contains: text, mode: 'insensitive' } }, take: 10, select: { id: true, username: true, profile: true } }),
      this.prisma.post.findMany({ where: { content: { contains: text, mode: 'insensitive' } }, take: 10 }),
      this.prisma.comment.findMany({ where: { content: { contains: text, mode: 'insensitive' } }, take: 10 }),
      this.prisma.forumTopic.findMany({ where: { OR: [{ title: { contains: text, mode: 'insensitive' } }, { content: { contains: text, mode: 'insensitive' } }] }, take: 10 }),
      this.prisma.community.findMany({ where: { OR: [{ name: { contains: text, mode: 'insensitive' } }, { description: { contains: text, mode: 'insensitive' } }] }, take: 10 })
    ]);
    return { users, posts, comments, topics, communities };
  }
}
