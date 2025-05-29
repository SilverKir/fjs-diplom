import { ObjectId } from 'mongoose';

import { HotelRoom } from '../models';
import { SearchRoomsParams } from './';

type ID = string | ObjectId;

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
