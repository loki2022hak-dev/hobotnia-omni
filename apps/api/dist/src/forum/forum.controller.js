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
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
class TopicDto {
    title;
    content;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], TopicDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], TopicDto.prototype, "content", void 0);
let ForumController = class ForumController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    categories() { return this.prisma.forumCategory.findMany({ include: { _count: { select: { topics: true } } } }); }
    async topics(slug) {
        const category = await this.prisma.forumCategory.findUniqueOrThrow({ where: { slug } });
        return this.prisma.forumTopic.findMany({ where: { categoryId: category.id }, orderBy: { createdAt: 'desc' } });
    }
    async create(user, slug, dto) {
        const category = await this.prisma.forumCategory.findUniqueOrThrow({ where: { slug } });
        return this.prisma.forumTopic.create({ data: { categoryId: category.id, authorId: user.sub, title: dto.title, content: dto.content } });
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "categories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories/:slug/topics'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "topics", null);
__decorate([
    (0, common_1.Post)('categories/:slug/topics'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, TopicDto]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "create", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)('forum'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ForumController);
//# sourceMappingURL=forum.controller.js.map