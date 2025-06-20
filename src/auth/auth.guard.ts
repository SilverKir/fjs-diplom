import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY, NOT_AUTH_KEY, ROLES_KEY } from './roles.decorator';
import { AuthService } from './auth.service';
import { tokenExtractor } from './auth.cookies.extractor';
import { Role, User } from 'src/users';

@Injectable()
export class AuthenticateGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isNotAuth = this.reflector.getAllAndOverride<boolean>(NOT_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const token = tokenExtractor(request);

    if (isNotAuth) {
      if (!token) {
        return true;
      }

      if (!(await this.authService.validateByToken(token))) {
        return true;
      }

      if (!requiredRoles) {
        return false;
      }
    }

    await super.canActivate(context);
    const user = request.user as User;

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
