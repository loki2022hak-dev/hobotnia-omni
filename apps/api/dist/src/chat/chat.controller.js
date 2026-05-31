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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const class_validator_1 = require("class-validator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const chat_gateway_1 = require("./chat.gateway");
class ChatDto {
    title;
    isGroup;
    memberIds;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChatDto.prototype, "isGroup", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ChatDto.prototype, "memberIds", void 0);
class MessageDto {
    content;
    attachments;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], MessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MessageDto.prototype, "attachments", void 0);
let ChatController = class ChatController {
    prisma;
    notifications;
    gateway;
    constructor(prisma, notifications, gateway) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.gateway = gateway;
    }
    list(user) {
        return this.prisma.chat.findMany({ where: { members: { some: { userId: user.sub } } }, include: { members: { include: { user: { select: { id: true, username: true } } } }, messages: { take: 1, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
    }
    create(user, dto) {
        const ids = Array.from(new Set([user.sub, ...dto.memberIds]));
        return this.prisma.chat.create({ data: { title: dto.title, isGroup: dto.isGroup, members: { create: ids.map(userId => ({ userId })) } } });
    }
    async assertMember(chatId, userId) {
        const member = await this.prisma.chatMember.findUnique({ where: { chatId_userId: { chatId, userId } } });
        if (!member)
            throw new common_1.ForbiddenException('Немає доступу до чату');
    }
    async messages(user, id) {
        await this.assertMember(id, user.sub);
        return this.prisma.message.findMany({ where: { chatId: id }, orderBy: { createdAt: 'asc' }, take: 100, include: { author: { select: { id: true, username: true } } } });
    }
    getMessages(user, id) { return this.messages(user, id); }
    async message(user, id, dto) {
        await this.assertMember(id, user.sub);
        const message = await this.prisma.message.create({ data: { chatId: id, authorId: user.sub, content: dto.content, attachments: dto.attachments ?? [] }, include: { author: { select: { username: true } }, chat: { include: { members: true } } } });
        this.gateway.server.to(id).emit('chat:message', message);
        await Promise.all(message.chat.members.filter((member) => member.userId !== user.sub).map((member) => this.notifications.create(member.userId, prisma_1.NotificationType.MESSAGE, 'Нове повідомлення', `@${message.author.username}: ${message.content}`)));
        return message;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChatDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "create", null);
__decorate([
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "messages", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, MessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "message", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService, chat_gateway_1.ChatGateway])
], ChatController);
//# sourceMappingURL=chat.controller.js.map