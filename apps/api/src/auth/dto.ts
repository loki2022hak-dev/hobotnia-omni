import { IsBoolean, IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @Length(3, 30) username!: string;
  @IsString() @MinLength(8) password!: string;
}

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
  @IsOptional() @IsBoolean() rememberMe?: boolean;
  @IsOptional() @IsString() twoFactorCode?: string;
}

export class RefreshDto {
  @IsString() refreshToken!: string;
}
