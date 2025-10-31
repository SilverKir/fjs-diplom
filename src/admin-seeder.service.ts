import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.warn(
        'Переменные окружения для администратора не заданы. Пропуск инициализации.',
      );
      return;
    }

    const adminExists = await this.userService.isUser();

    if (!adminExists) {
      console.log('Пользователь администратора не найден. Создание нового...');
      const adminUser = {
        email: adminEmail,
        password: adminPassword,
        name: 'admin',
        role: 'admin',
      };
      await this.userService.create(adminUser);
      console.log('Пользователь администратора успешно создан.');
    } else {
      console.log('Пользователь администратора уже существует.');
    }
  }
}
