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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const class_validator_1 = require("class-validator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
class CreateCommentDto {
    content;
    parentId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "parentId", void 0);
let CommentsController = class CommentsController {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    list(postId) { return this.prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, username: true, profile: true } }, replies: true } }); }
    async create(user, postId, dto) {
        const comment = await this.prisma.comment.create({ data: { postId, authorId: user.sub, content: dto.content, parentId: dto.parentId }, include: { author: { select: { username: true } }, post: true } });
        if (comment.post.authorId !== user.sub) {
            await this.notifications.create(comment.post.authorId, prisma_1.NotificationType.COMMENT, 'Новий коментар', `@${comment.author.username} прокоментував твій пост`);
        }
        return comment;
    }
    async remove(user, id) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException();
        if (comment.authorId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'comment.delete', entity: 'comment', entityId: id } });
        return this.prisma.comment.delete({ where: { id } });
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('posts/:postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('posts/:postId/comments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "remove", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map