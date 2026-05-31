import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto, ip?: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto, ip?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string, ip?: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    enable2fa(userId: string): Promise<{
        secret: string;
        otpauth: string;
    }>;
    confirm2fa(userId: string, code: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string;
        passwordHash: string;
        role: import("src/generated/prisma").$Enums.Role;
        emailVerifiedAt: Date | null;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        reputation: number;
        premiumUntil: Date | null;
    }>;
    verifyEmail(userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string;
        passwordHash: string;
        role: import("src/generated/prisma").$Enums.Role;
        emailVerifiedAt: Date | null;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        reputation: number;
        premiumUntil: Date | null;
    }>;
    private issueTokens;
}
