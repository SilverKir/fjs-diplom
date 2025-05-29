import { Injectable } from '@nestjs/common';
import { Schema, Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from './interfaces';
import { Hotel, HotelDocument } from './models';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  create(data: any): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }
  findById(id: string | Schema.Types.ObjectId): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }
  search(params: SearchHotelParams): Promise<Hotel[]> {
    throw new Error('Method not implemented.');
  }
  update(
    id: string | Schema.Types.ObjectId,
    data: UpdateHotelParams,
  ): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }
}
