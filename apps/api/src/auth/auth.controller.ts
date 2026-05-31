import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public() @Get('csrf')
  csrf(@Req() req: any) { return { csrfToken: req.csrfToken() }; }

  @Public() @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: any) { return this.auth.register(dto, req.ip); }

  @Public() @Post('login')
  login(@Body() dto: LoginDto, @Req() req: any) { return this.auth.login(dto, req.ip, req.headers['user-agent']); }

  @Public() @Post('refresh')
  refresh(@Body() dto: RefreshDto, @Req() req: any) { return this.auth.refresh(dto.refreshToken, req.ip); }

  @Post('2fa/setup')
  setup2fa(@CurrentUser() user: any) { return this.auth.enable2fa(user.sub); }

  @Post('2fa/confirm')
  confirm2fa(@CurrentUser() user: any, @Body('code') code: string) { return this.auth.confirm2fa(user.sub, code); }

  @Post('email/verify')
  verifyEmail(@CurrentUser() user: any) { return this.auth.verifyEmail(user.sub); }
}
