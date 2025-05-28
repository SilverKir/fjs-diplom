import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './CreateUserDto';
import { Role } from '../users.roles.enum';

export class AdminCreateUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: string;
}
