import { ObjectId } from 'mongoose';

export interface ReservationDto {
  userId: ObjectId | string;
  hotelId: ObjectId | string;
  roomId: ObjectId | string;
  dateStart: Date;
  dateEnd: Date;
}
