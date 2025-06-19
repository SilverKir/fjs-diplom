import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.model';
import { JwtService } from '@nestjs/jwt';

import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userEmail: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(userEmail);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async validateById(id: string): Promise<User | null> {
    try {
      const user = await this.usersService.findById(id);
      return user ? user : null;
    } catch {
      return null;
    }
  }

  async validateByToken(token: string): Promise<User | null> {
    try {
      const payload: { id: string } = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return await this.validateById(payload.id);
    } catch {
      return null;
    }
  }

  async login(req: Request, response: Response) {
    const user = req.user as User;
    const payload = {
      id: user._id,
    };
    const id = await this.jwtService.signAsync(payload);
    response.cookie('id', id, { httpOnly: false });
  }

  logout(response: Response) {
    response.clearCookie('id');
  }
}
