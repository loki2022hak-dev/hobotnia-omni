import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto } from './dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    csrf(req: any): {
        csrfToken: any;
    };
    register(dto: RegisterDto, req: any): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto, req: any): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshDto, req: any): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    setup2fa(user: any): Promise<{
        secret: string;
        otpauth: string;
    }>;
    confirm2fa(user: any, code: string): Promise<{
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
    verifyEmail(user: any): Promise<{
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
}
