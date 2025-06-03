import { IsNotEmpty } from 'class-validator';

export class AddRoomDto {
  description?: string;

  @IsNotEmpty()
  hotelId: string;

  images?: string[];

  isEnabled?: boolean;
}
