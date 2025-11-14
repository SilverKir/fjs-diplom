import { Controller, Post, Body, Get, Query } from '@nestjs/common';

import { UsersService } from './users.service';
import { ISearchUserParams, IUserAnswer } from './interfaces';
import { AdminCreateUserDto } from './dto/AdminCreateUserDto';
import { Roles } from 'src/auth';
import { Role } from './users.roles.enum';

@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   *  создание администратором нового пользователя
   * @param createUser
   * @returns
   */
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

  /**
   * получение администратором и менеджером списка зарегистрированных клиентов
   * @param limit - количество отображаемых клиентов на одной странице
   * @param offset - с какого клиента начинать отображение
   * @param name - поиск по имени
   * @param email - поиск по email
   * @param contactPhone - поиск по телефону
   * @returns список клиенов, соответстующих критериям отбора
   */
  @Roles(Role.Admin, Role.Manager)
  @Get(['admin/users', 'manager/users'])
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
