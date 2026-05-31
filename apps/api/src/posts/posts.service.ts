import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private notifications: NotificationsService) {}
  feed() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { author: { select: { id: true, username: true, profile: true } }, _count: { select: { likes: true, comments: true, reposts: true } } } });
  }
  create(authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({ data: { authorId, content: dto.content, mediaUrls: dto.mediaUrls ?? [], communityId: dto.communityId } });
  }
  async update(user: any, id: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.authorId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'post.update', entity: 'post', entityId: id } });
    return this.prisma.post.update({ where: { id }, data: { content: dto.content } });
  }
  async remove(user: any, id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.authorId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'post.delete', entity: 'post', entityId: id } });
    return this.prisma.post.delete({ where: { id } });
  }
  async toggleLike(userId: string, postId: string) {
    const existing = await this.prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
    if (existing) return this.prisma.like.delete({ where: { id: existing.id } });
    const like = await this.prisma.like.create({ data: { userId, postId }, include: { user: { select: { username: true } }, post: true } });
    if (like.post.authorId !== userId) {
      await this.notifications.create(like.post.authorId, NotificationType.LIKE, 'Новий лайк', `@${like.user.username} вподобав твій пост`);
    }
    return like;
  }
  save(userId: string, postId: string) {
    return this.prisma.savedPost.upsert({ where: { userId_postId: { userId, postId } }, update: {}, create: { userId, postId } });
  }
  async repost(authorId: string, postId: string) {
    const source = await this.prisma.post.findUnique({ where: { id: postId }, include: { author: { select: { username: true } } } });
    if (!source) throw new NotFoundException();
    const repost = await this.prisma.post.create({ data: { authorId, repostOfId: postId, content: `Репост @${source.author.username}: ${source.content}` } });
    if (source.authorId !== authorId) {
      await this.notifications.create(source.authorId, NotificationType.FOLLOW, 'Новий репост', 'Твій пост поширили у стрічці');
    }
    return repost;
  }
}
