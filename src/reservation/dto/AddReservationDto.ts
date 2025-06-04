import { IsNotEmpty } from 'class-validator';

export class AddReservationDto {
  @IsNotEmpty()
  hotelRoom: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;
}
