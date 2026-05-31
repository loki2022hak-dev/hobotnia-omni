import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
export declare class JwtGuard implements CanActivate {
    private jwt;
    private reflector;
    constructor(jwt: JwtService, reflector: Reflector);
    canActivate(ctx: ExecutionContext): boolean;
}
