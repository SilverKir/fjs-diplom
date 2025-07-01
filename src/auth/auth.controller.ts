import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Body,
  Get,
} from '@nestjs/common';
import { Response } from 'express';

import { LocalAuthGuard, AuthService, NotAuth, Public } from '.';

import { UsersService, CreateUserDto, IUserAnswer, User } from 'src/users';

@Controller('api')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @NotAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.login(req, response);
    const user = req.user as User;
    const answer = {
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      token: token,
    };

    return answer;
  }

  @Post('auth/logout')
  logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    this.authService.logout(res);
  }

  @NotAuth()
  @Post('client/register')
  async create(@Body() createUser: CreateUserDto): Promise<IUserAnswer> {
    const result = await this.usersService.create(createUser);
    return {
      id: result._id,
      email: result.email,
      name: result.name,
    };
  }

  @Public()
  @Get('nav')
  async setNav(@Request() req) {
    return await this.authService.getRole(req);
  }
}
