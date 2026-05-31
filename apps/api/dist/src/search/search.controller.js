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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
let SearchController = class SearchController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(q = '') {
        const text = q.trim();
        if (!text)
            return { users: [], posts: [], comments: [], topics: [], communities: [] };
        const [users, posts, comments, topics, communities] = await Promise.all([
            this.prisma.user.findMany({ where: { username: { contains: text, mode: 'insensitive' } }, take: 10, select: { id: true, username: true, profile: true } }),
            this.prisma.post.findMany({ where: { content: { contains: text, mode: 'insensitive' } }, take: 10 }),
            this.prisma.comment.findMany({ where: { content: { contains: text, mode: 'insensitive' } }, take: 10 }),
            this.prisma.forumTopic.findMany({ where: { OR: [{ title: { contains: text, mode: 'insensitive' } }, { content: { contains: text, mode: 'insensitive' } }] }, take: 10 }),
            this.prisma.community.findMany({ where: { OR: [{ name: { contains: text, mode: 'insensitive' } }, { description: { contains: text, mode: 'insensitive' } }] }, take: 10 })
        ]);
        return { users, posts, comments, topics, communities };
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchController);
//# sourceMappingURL=search.controller.js.map