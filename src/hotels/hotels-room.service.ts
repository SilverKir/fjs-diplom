import { Injectable, BadRequestException } from '@nestjs/common';
import { Schema, Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { multerConfig } from './config/multer.config';

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
      isEnabled: true,
    };
    const room = new this.RoomModel(newRoom);
    return await room.save();
  }

  async findById(id: string | Schema.Types.ObjectId): Promise<HotelRoom> {
    const result = await this.RoomModel.findById(id).select('-__v').exec();
    if (result) {
      return result;
    }
    throw new BadRequestException('Wrong ID');
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const isEnabled = params.isEnabled ? params.isEnabled : true;
    const rooms = await this.RoomModel.find({
      isEnabled: isEnabled,
      hotel: params.hotel,
    })
      .select('-__v')
      .exec();
    const limit = params.limit ? params.limit : rooms.length;
    const offset = params.offset ? params.offset : 0;
    return rooms.slice(offset, Number(limit) + Number(offset));
  }

  async update(
    id: string | Schema.Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom> {
    const room = await this.RoomModel.findById(id);
    if (!room) {
      throw new BadRequestException('Wrong ID');
    }
    if (data.description) room.description = data.description;
    if (data.images) room.images = data.images;
    if (data.hotel) room.hotel = data.hotel;
    if (data.isEnabled) room.isEnabled = data.isEnabled;
    await room.save();
    return room;
  }

  imageFileDelete(fileName: string): void {
    const filePath = path.join(multerConfig.dest, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  arrayDifference(
    initialArr: string[],
    savedArr: string[] | undefined,
  ): string[] {
    if (!initialArr) return [];
    if (!savedArr) return initialArr;
    return initialArr.filter((item) => !savedArr.includes(item));
  }

  updateFiles(initialArr: string[], savedArr: string[] | undefined): void {
    const diffArr = this.arrayDifference(initialArr, savedArr);
    if (!diffArr) return;
    diffArr.forEach((value) => this.imageFileDelete(value));
  }
}
