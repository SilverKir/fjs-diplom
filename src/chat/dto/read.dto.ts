import { IsNotEmpty } from 'class-validator';

export class ReadDto {
  @IsNotEmpty()
  createdBefore: string;
}
