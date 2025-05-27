import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { LocalAuthGuard, Public, UnconfirmedGuard, AuthService } from './auth';

@Controller('api')
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(UnconfirmedGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(req, response);
  }

  @Post('auth/logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
  }
}
