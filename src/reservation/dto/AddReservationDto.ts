import { IsDate, IsNotEmpty } from 'class-validator';
import { ReservationDto } from '../interfaces/ReservationDto';
import { Schema } from 'mongoose';

export class AddReservationDto implements ReservationDto {
  userId: string | Schema.Types.ObjectId;

  hotelId: string | Schema.Types.ObjectId;

  @IsNotEmpty()
  roomId: string | Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsDate()
  dateStart: Date;

  @IsNotEmpty()
  @IsDate()
  dateEnd: Date;
}
