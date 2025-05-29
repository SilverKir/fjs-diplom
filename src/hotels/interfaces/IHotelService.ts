import { ObjectId } from 'mongoose';

import { Hotel } from '../models';
import { SearchHotelParams, UpdateHotelParams } from './';

type ID = string | ObjectId;

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}
