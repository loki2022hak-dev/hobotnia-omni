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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const otplib_1 = require("otplib");
const prisma_service_1 = require("../common/prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto, ip) {
        const exists = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { username: dto.username }] } });
        if (exists)
            throw new common_1.BadRequestException('Email або username вже зайнятий');
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                username: dto.username,
                passwordHash: await bcryptjs_1.default.hash(dto.password, 12),
                profile: { create: {} },
                auditLogs: { create: { action: 'register', entity: 'user', ip } }
            },
            include: { profile: true }
        });
        return this.issueTokens(user, false, ip);
    }
    async login(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (!user || !(await bcryptjs_1.default.compare(dto.password, user.passwordHash)))
            throw new common_1.UnauthorizedException('Невірні облікові дані');
        if (user.twoFactorEnabled && !otplib_1.authenticator.check(dto.twoFactorCode ?? '', user.twoFactorSecret ?? '')) {
            throw new common_1.UnauthorizedException('Потрібен коректний 2FA код');
        }
        return this.issueTokens(user, Boolean(dto.rememberMe), ip, userAgent);
    }
    async refresh(refreshToken, ip) {
        const payload = this.jwt.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
        const tokenHash = await bcryptjs_1.default.hash(refreshToken, 4);
        const stored = await this.prisma.refreshToken.findFirst({ where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } } });
        if (!stored || !(await bcryptjs_1.default.compare(refreshToken, stored.tokenHash)))
            throw new common_1.UnauthorizedException();
        await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
        return this.issueTokens(user, true, ip);
    }
    async enable2fa(userId) {
        const secret = otplib_1.authenticator.generateSecret();
        await this.prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
        return { secret, otpauth: otplib_1.authenticator.keyuri(userId, 'Хоботня', secret) };
    }
    async confirm2fa(userId, code) {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        if (!otplib_1.authenticator.check(code, user.twoFactorSecret ?? ''))
            throw new common_1.BadRequestException('Невірний код');
        return this.prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    }
    async verifyEmail(userId) {
        return this.prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
    }
    async issueTokens(user, remember, ip, userAgent) {
        const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
        const accessToken = this.jwt.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_TTL ?? '15m' });
        const refreshToken = this.jwt.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: remember ? '60d' : process.env.JWT_REFRESH_TTL ?? '30d' });
        await this.prisma.refreshToken.create({
            data: { userId: user.id, tokenHash: await bcryptjs_1.default.hash(refreshToken, 12), expiresAt: new Date(Date.now() + (remember ? 60 : 30) * 86400000), ip, userAgent }
        });
        return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map