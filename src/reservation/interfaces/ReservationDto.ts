import { ObjectId } from 'mongoose';
import { Hotel, HotelRoom } from 'src/hotels/models';
export interface ReservationDto {
  userId: ObjectId | string;
  hotelId: Hotel;
  roomId: HotelRoom;
  dateStart: Date;
  dateEnd: Date;
}
