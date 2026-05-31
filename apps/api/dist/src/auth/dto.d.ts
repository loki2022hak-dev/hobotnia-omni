export declare class RegisterDto {
    email: string;
    username: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
    twoFactorCode?: string;
}
export declare class RefreshDto {
    refreshToken: string;
}
