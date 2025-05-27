import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateClientUserDto, IClientUserAnswer } from './interfaces';
import { User } from './users.models';
import { Role } from './users.roles.enum';

@Controller('api')
export class UsersController {
  constructor(private servise: UsersService) {}

  @Post('client/register')
  async create(
    @Body() createUser: CreateClientUserDto,
  ): Promise<IClientUserAnswer> {
    const saltOrRounds = 10;
    const newUser = new User({
      email: createUser.email,
      name: createUser.name,
      passwordHash: await bcrypt.hash(createUser.password, saltOrRounds),
      contactPhone: createUser.contactPhone,
      role: Role.Client,
    });

    try {
      const result = await this.servise.create(newUser);
      return {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        id: result._id.toString(),
        email: result.email,
        name: result.name,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
