import { Injectable, BadRequestException } from '@nestjs/common';
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

  async create(data: Partial<Hotel>): Promise<Hotel> {
    const newHotel = { ...data, createdAt: new Date(), updatedAt: new Date() };
    const hotel = new this.HotelModel(newHotel);
    return await hotel.save();
  }

  async findById(id: string | Schema.Types.ObjectId): Promise<Hotel> {
    const result = await this.HotelModel.findById(id).select('-__v').exec();
    if (result) {
      return result;
    }
    throw new BadRequestException('Wrong ID');
  }

  async search(params: SearchHotelParams): Promise<Hotel[] | null> {
    const title = params.title ? params.title : '';
    const hotels = await this.HotelModel.find({
      title: { $regex: title, $options: 'i' },
    })
      .select('-__v')
      .exec();
    const limit = params.limit ? params.limit : hotels.length;
    const offset = params.offset ? params.offset : 0;
    return hotels.slice(offset, Number(limit) + Number(offset));
  }

  async update(
    id: string | Schema.Types.ObjectId,
    data: UpdateHotelParams,
  ): Promise<Hotel> {
    try {
      const hotel = await this.HotelModel.findById(id);
      if (!hotel) {
        throw new BadRequestException('No hotel to update');
      }
      hotel.title = data.title;
      hotel.description = data.description;
      hotel.updatedAt = new Date();
      await hotel.save();
      return hotel;
    } catch {
      throw new BadRequestException('Wrong ID');
    }
  }
}
