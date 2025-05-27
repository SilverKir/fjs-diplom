import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { UnconfirmedGuard } from './auth/unconfirmed.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/roles.decorator';

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
