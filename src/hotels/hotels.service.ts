import { Injectable } from '@nestjs/common';
import { Schema, Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from './interfaces';
import { Hotel, HotelDocument } from './models';
import { AddHotelDto } from './dto/AddHotelDto';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(data: AddHotelDto): Promise<Hotel> {
    const newHotel = { ...data, createdAt: new Date(), updatedAt: new Date() };
    const hotel = new this.HotelModel(newHotel);
    return await hotel.save();
  }

  async findById(id: string | Schema.Types.ObjectId): Promise<Hotel | null> {
    return await this.HotelModel.findById(id).select('-__v').exec();
  }

  async search(params: SearchHotelParams): Promise<Hotel[] | null> {
    const hotels = await this.HotelModel.find({
      title: { $regex: params.title, $options: 'i' },
    })
      .select('-__v')
      .exec();
    const limit = params.limit ? params.limit : hotels.length;
    return hotels.slice(params.offset, Number(limit) + Number(params.offset));
  }

  async update(
    id: string | Schema.Types.ObjectId,
    data: UpdateHotelParams,
  ): Promise<Hotel | null> {
    return await this.HotelModel.findByIdAndUpdate(id, data)
      .select('-__v')
      .exec();
  }
}
