import { Injectable, BadRequestException } from '@nestjs/common';
import { Schema, Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { IHotelRoomService, SearchRoomsParams } from './interfaces';
import { HotelRoom, RoomDocument } from './models';


@Injectable()
export class HotelsRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private RoomModel: Model<RoomDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const newRoom = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEnabled: true,
    };
    const room = new this.RoomModel(newRoom);
    return await room.save();
  }

  findById(id: string | Schema.Types.ObjectId): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }
  search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    throw new Error('Method not implemented.');
  }
  update(
    id: string | Schema.Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }
}
