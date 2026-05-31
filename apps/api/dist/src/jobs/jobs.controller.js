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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
const class_validator_1 = require("class-validator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const prisma_service_1 = require("../common/prisma/prisma.service");
class JobDto {
    company;
    title;
    description;
    city;
    type;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], JobDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(prisma_1.JobType),
    __metadata("design:type", String)
], JobDto.prototype, "type", void 0);
class ApplyDto {
    resumeUrl;
    coverText;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyDto.prototype, "resumeUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyDto.prototype, "coverText", void 0);
let JobsController = class JobsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() { return this.prisma.jobPost.findMany({ orderBy: { createdAt: 'desc' } }); }
    create(user, dto) {
        return this.prisma.$transaction(async (tx) => {
            const job = await tx.jobPost.create({ data: dto });
            await tx.auditLog.create({ data: { actorId: user.sub, action: 'job.create', entity: 'jobPost', entityId: job.id } });
            return job;
        });
    }
    apply(user, id, dto) { return this.prisma.jobApplication.create({ data: { jobId: id, userId: user.sub, ...dto } }); }
    async update(user, id, dto) {
        const job = await this.prisma.jobPost.update({ where: { id }, data: dto });
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'job.update', entity: 'jobPost', entityId: id } });
        return job;
    }
    async remove(user, id) {
        const job = await this.prisma.jobPost.delete({ where: { id } });
        await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'job.delete', entity: 'jobPost', entityId: id } });
        return job;
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "list", null);
__decorate([
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.MODERATOR, prisma_1.Role.PREMIUM),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, JobDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/apply'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ApplyDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "apply", null);
__decorate([
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.MODERATOR),
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, JobDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.MODERATOR),
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "remove", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map