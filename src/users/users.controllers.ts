import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { UsersService } from './users.service';
import { ISearchUserParams, IUserAnswer } from './interfaces';
import { AdminCreateUserDto } from './dto/AdminCreateUserDto';
import { Roles, RolesGuard } from 'src/auth';
import { Role } from './users.roles.enum';

@UseGuards(RolesGuard)
@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.Admin)
  @Post('admin/users')
  async create(@Body() createUser: AdminCreateUserDto): Promise<IUserAnswer> {
    const result = await this.usersService.create(createUser);
    return {
      id: result._id,
      email: result.email,
      name: result.name,
      contactPhone: result.contactPhone,
      role: result.role,
    };
  }

  @Roles(Role.Admin)
  @Get('admin/users')
  async getUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('contactPhone') contactPhone?: string,
  ): Promise<IUserAnswer[] | null> {
    const query: ISearchUserParams = {
      limit: limit ? limit : 0,
      offset: offset ? offset : 0,
      email: email ? email : '',
      name: name ? name : '',
      contactPhone: contactPhone ? contactPhone : '',
    };
    const users = await this.usersService.findAll(query);

    return users
      ? users.map((obj) => {
          return {
            id: obj._id,
            email: obj.email,
            name: obj.name,
            contactPhone: obj.contactPhone,
          };
        })
      : null;
  }
}
