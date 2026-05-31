import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto, ip?: string) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { username: dto.username }] } });
    if (exists) throw new BadRequestException('Email або username вже зайнятий');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username,
        passwordHash: await bcrypt.hash(dto.password, 12),
        profile: { create: {} },
        auditLogs: { create: { action: 'register', entity: 'user', ip } }
      },
      include: { profile: true }
    });
    return this.issueTokens(user, false, ip);
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Невірні облікові дані');
    if (user.twoFactorEnabled && !authenticator.check(dto.twoFactorCode ?? '', user.twoFactorSecret ?? '')) {
      throw new UnauthorizedException('Потрібен коректний 2FA код');
    }
    return this.issueTokens(user, Boolean(dto.rememberMe), ip, userAgent);
  }

  async refresh(refreshToken: string, ip?: string) {
    const payload = this.jwt.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    const tokenHash = await bcrypt.hash(refreshToken, 4);
    const stored = await this.prisma.refreshToken.findFirst({ where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } } });
    if (!stored || !(await bcrypt.compare(refreshToken, stored.tokenHash))) throw new UnauthorizedException();
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
    return this.issueTokens(user, true, ip);
  }

  async enable2fa(userId: string) {
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
    return { secret, otpauth: authenticator.keyuri(userId, 'Хоботня', secret) };
  }

  async confirm2fa(userId: string, code: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!authenticator.check(code, user.twoFactorSecret ?? '')) throw new BadRequestException('Невірний код');
    return this.prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
  }

  async verifyEmail(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
  }

  private async issueTokens(user: { id: string; email: string; username: string; role: string }, remember: boolean, ip?: string, userAgent?: string) {
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
    const accessToken = this.jwt.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_TTL ?? '15m' });
    const refreshToken = this.jwt.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: remember ? '60d' : process.env.JWT_REFRESH_TTL ?? '30d' });
    await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: await bcrypt.hash(refreshToken, 12), expiresAt: new Date(Date.now() + (remember ? 60 : 30) * 86400000), ip, userAgent }
    });
    return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, accessToken, refreshToken };
  }
}
