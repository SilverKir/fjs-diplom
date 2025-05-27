import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.models';
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
    const user = await this.usersService.findById(id);
    return user ? user : null;
  }

  async validateByToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return false;
    } catch {
      return true;
    }
  }

  async login(req, response: Response) {
    const user: User = req.user;
    const answer = {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
    const payload = {
      id: user._id.toString(),
    };
    const id = this.jwtService.sign(payload);
    response.cookie('id', id);
    return answer;
  }

  async logout(response: Response) {
    response.clearCookie('id');
  }
}
