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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const class_validator_1 = require("class-validator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
class ItemDto {
    title;
    description;
    price;
    category;
    photoUrls;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], ItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ItemDto.prototype, "photoUrls", void 0);
let MarketplaceController = class MarketplaceController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(q, category) {
        return this.prisma.marketplaceItem.findMany({ where: { status: 'ACTIVE', ...(category ? { category } : {}), ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}) }, orderBy: { createdAt: 'desc' } });
    }
    create(user, dto) { return this.prisma.marketplaceItem.create({ data: { ...dto, sellerId: user.sub } }); }
    async update(user, id, dto) {
        const item = await this.prisma.marketplaceItem.findUniqueOrThrow({ where: { id } });
        if (item.sellerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'marketplace.update', entity: 'marketplaceItem', entityId: id } });
        return this.prisma.marketplaceItem.update({ where: { id }, data: dto });
    }
    async markSold(user, id) {
        const item = await this.prisma.marketplaceItem.findUniqueOrThrow({ where: { id } });
        if (item.sellerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        return this.prisma.marketplaceItem.update({ where: { id }, data: { status: prisma_1.MarketplaceStatus.SOLD } });
    }
    async remove(user, id) {
        const item = await this.prisma.marketplaceItem.findUniqueOrThrow({ where: { id } });
        if (item.sellerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role))
            throw new common_1.ForbiddenException();
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'marketplace.delete', entity: 'marketplaceItem', entityId: id } });
        return this.prisma.marketplaceItem.update({ where: { id }, data: { status: prisma_1.MarketplaceStatus.ARCHIVED } });
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ItemDto]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ItemDto]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sold'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "markSold", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "remove", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map