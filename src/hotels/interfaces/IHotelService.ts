import { ObjectId } from 'mongoose';

import { Hotel } from '../models';
import { SearchHotelParams, UpdateHotelParams } from './';

type ID = string | ObjectId;

export interface IHotelService {
  create(data: Partial<Hotel>): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[] | null>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel | null>;
}
