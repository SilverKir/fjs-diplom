import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from '../services';
import { CreateClientUserDto, IUser } from '../interfaces';
import { User } from '../models';

@Controller('api')
export class UsersController {
  constructor(private servise: UsersService) {}
  @Post('client/register')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUser: CreateClientUserDto): Promise<IUser> {
    const newUser = new User();
    newUser.email = createUser.email;
    newUser.name = createUser.name;
    newUser.passwordHash = createUser.password;
    newUser.contactPhone = createUser.contactPhone;
    newUser.role = 'client';

    return await this.servise.create(newUser);
  }
}
