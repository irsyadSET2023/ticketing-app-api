import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRequest } from '../request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('roles', context.getHandler());
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as UserRequest;
    if (roles.includes(user.role)) {
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
