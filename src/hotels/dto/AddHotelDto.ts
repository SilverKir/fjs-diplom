import { IsNotEmpty } from 'class-validator';

export class AddHotelDto {
  @IsNotEmpty()
  title: string;

  description: string;
}
