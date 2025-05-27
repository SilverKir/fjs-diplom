import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Request,
} from '@nestjs/common';

import { cookieExtractor } from './auth.cookies.extractor';
import { AuthService } from './auth.service';

@Injectable()
export class UnconfirmedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = cookieExtractor(request);

    if (!token) {
      return true;
    }
    return await this.authService.validateByToken(token);
  }
}
