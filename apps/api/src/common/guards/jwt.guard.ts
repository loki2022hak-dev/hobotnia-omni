import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService, private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()])) return true;
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.access_token;
    if (!token) throw new UnauthorizedException();
    try {
      req.user = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
