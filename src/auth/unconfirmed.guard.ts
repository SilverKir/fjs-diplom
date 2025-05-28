import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from './auth.service';

import { cookieExtractor } from './auth.cookies.extractor';

@Injectable()
export class UnconfirmedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = cookieExtractor(request);

    if (!token) {
      return true;
    }
    const user = await this.authService.validateByToken(token);
    return user ? false : true;
  }
}
