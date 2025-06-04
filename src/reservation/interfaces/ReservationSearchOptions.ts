import { ObjectId } from 'mongoose';

export interface ReservationSearchOptions {
  userId: ObjectId | string;
  dateStart: Date;
  dateEnd: Date;
}
