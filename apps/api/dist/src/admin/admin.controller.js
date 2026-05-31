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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_1 = require("../generated/prisma");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
class RoleDto {
    role;
}
__decorate([
    (0, class_validator_1.IsEnum)(prisma_1.Role),
    __metadata("design:type", String)
], RoleDto.prototype, "role", void 0);
class ReportStatusDto {
    status;
}
__decorate([
    (0, class_validator_1.IsEnum)(prisma_1.ReportStatus),
    __metadata("design:type", String)
], ReportStatusDto.prototype, "status", void 0);
let AdminController = class AdminController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async stats() {
        const [users, posts, reports, communities] = await Promise.all([this.prisma.user.count(), this.prisma.post.count(), this.prisma.report.count(), this.prisma.community.count()]);
        return { users, posts, reports, communities };
    }
    users() {
        return this.prisma.user.findMany({
            take: 100,
            select: { id: true, email: true, username: true, role: true, status: true, reputation: true, createdAt: true, profile: true }
        });
    }
    reports() { return this.prisma.report.findMany({ orderBy: { createdAt: 'desc' }, include: { author: true, post: true, comment: true } }); }
    audit() { return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { actor: { select: { id: true, username: true, role: true } } } }); }
    async updateRole(admin, id, dto) {
        const user = await this.prisma.user.update({ where: { id }, data: { role: dto.role } });
        await this.prisma.auditLog.create({ data: { actorId: admin.sub, action: 'admin.user.role.update', entity: 'user', entityId: id, metadata: { role: dto.role } } });
        return user;
    }
    async updateReport(admin, id, dto) {
        const report = await this.prisma.report.update({ where: { id }, data: { status: dto.status } });
        await this.prisma.auditLog.create({ data: { actorId: admin.sub, action: 'admin.report.status.update', entity: 'report', entityId: id, metadata: { status: dto.status } } });
        return report;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Get)('reports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reports", null);
__decorate([
    (0, common_1.Get)('audit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "audit", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Patch)('reports/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReportStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateReport", null);
exports.AdminController = AdminController = __decorate([
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map