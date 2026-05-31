import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

class TopicDto { @IsString() @MinLength(3) title!: string; @IsString() @MinLength(10) content!: string; }

@Controller('forum')
export class ForumController {
  constructor(private prisma: PrismaService) {}
  @Public() @Get('categories') categories() { return this.prisma.forumCategory.findMany({ include: { _count: { select: { topics: true } } } }); }
  @Public() @Get('categories/:slug/topics') async topics(@Param('slug') slug: string) {
    const category = await this.prisma.forumCategory.findUniqueOrThrow({ where: { slug } });
    return this.prisma.forumTopic.findMany({ where: { categoryId: category.id }, orderBy: { createdAt: 'desc' } });
  }
  @Post('categories/:slug/topics') async create(@CurrentUser() user: any, @Param('slug') slug: string, @Body() dto: TopicDto) {
    const category = await this.prisma.forumCategory.findUniqueOrThrow({ where: { slug } });
    return this.prisma.forumTopic.create({ data: { categoryId: category.id, authorId: user.sub, title: dto.title, content: dto.content } });
  }
}
