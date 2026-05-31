"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PostsService = class PostsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    feed() {
        return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { author: { select: { id: true, username: true, profile: true } }, _count: { select: { likes: true, comments: true, reposts: true } } } });
    }
    create(authorId, dto) {
        return this.prisma.post.create({ data: { authorId, content: dto.content, mediaUrls: dto.mediaUrls ?? [], communityId: dto.communityId } });
    }
    async update(user, id, dto) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException();
        if (post.authorId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'post.update', entity: 'post', entityId: id } });
        return this.prisma.post.update({ where: { id }, data: { content: dto.content } });
    }
    async remove(user, id) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException();
        if (post.authorId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'post.delete', entity: 'post', entityId: id } });
        return this.prisma.post.delete({ where: { id } });
    }
    async toggleLike(userId, postId) {
        const existing = await this.prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
        if (existing)
            return this.prisma.like.delete({ where: { id: existing.id } });
        const like = await this.prisma.like.create({ data: { userId, postId }, include: { user: { select: { username: true } }, post: true } });
        if (like.post.authorId !== userId) {
            await this.notifications.create(like.post.authorId, prisma_1.NotificationType.LIKE, 'Новий лайк', `@${like.user.username} вподобав твій пост`);
        }
        return like;
    }
    save(userId, postId) {
        return this.prisma.savedPost.upsert({ where: { userId_postId: { userId, postId } }, update: {}, create: { userId, postId } });
    }
    async repost(authorId, postId) {
        const source = await this.prisma.post.findUnique({ where: { id: postId }, include: { author: { select: { username: true } } } });
        if (!source)
            throw new common_1.NotFoundException();
        const repost = await this.prisma.post.create({ data: { authorId, repostOfId: postId, content: `Репост @${source.author.username}: ${source.content}` } });
        if (source.authorId !== authorId) {
            await this.notifications.create(source.authorId, prisma_1.NotificationType.FOLLOW, 'Новий репост', 'Твій пост поширили у стрічці');
        }
        return repost;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map