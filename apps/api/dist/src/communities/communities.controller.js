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
exports.CommunitiesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const class_validator_1 = require("class-validator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
class CreateCommunityDto {
    name;
    slug;
    description;
    visibility;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 80),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 60),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.Visibility),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "visibility", void 0);
let CommunitiesController = class CommunitiesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() { return this.prisma.community.findMany({ include: { _count: { select: { members: true, posts: true } } }, orderBy: { createdAt: 'desc' } }); }
    create(user, dto) {
        return this.prisma.community.create({ data: { ...dto, ownerId: user.sub, members: { create: { userId: user.sub, role: 'ADMIN' } } } });
    }
    join(user, id) {
        return this.prisma.communityMember.upsert({ where: { userId_communityId: { userId: user.sub, communityId: id } }, update: {}, create: { userId: user.sub, communityId: id } });
    }
    async update(user, id, dto) {
        const community = await this.prisma.community.findUniqueOrThrow({ where: { id } });
        if (community.ownerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'community.update', entity: 'community', entityId: id } });
        return this.prisma.community.update({ where: { id }, data: dto });
    }
    async remove(user, id) {
        const community = await this.prisma.community.findUniqueOrThrow({ where: { id } });
        if (community.ownerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'community.delete', entity: 'community', entityId: id } });
        return this.prisma.community.delete({ where: { id } });
    }
};
exports.CommunitiesController = CommunitiesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateCommunityDto]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "join", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateCommunityDto]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "remove", null);
exports.CommunitiesController = CommunitiesController = __decorate([
    (0, common_1.Controller)('communities'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommunitiesController);
//# sourceMappingURL=communities.controller.js.map