import { ObjectId } from 'mongoose';

import { ReservationDto } from './ReservationDto';
import { ReservationSearchOptions } from './ReservationSearchOptions';
import { Reservation } from '../reservation.model';

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ObjectId | string): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
