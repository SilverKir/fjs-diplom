import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/models';
import { JwtService } from '@nestjs/jwt';

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
    console.log(user);
    return user ? user : null;
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
