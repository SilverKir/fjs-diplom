import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { jwtConstants } from './constants';
import { cookieExtractor } from './auth.cookies.extractor';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.authService.validateById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
