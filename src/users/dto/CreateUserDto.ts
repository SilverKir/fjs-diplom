import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(6)
  password: string;

  @IsNotEmpty()
  name: string;

  contactPhone: string;
}
