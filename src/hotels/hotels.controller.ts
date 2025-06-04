import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Roles, Public } from 'src/auth';
import { Role } from 'src/users';

import { HotelsService } from './hotels.service';
import { AddHotelDto, AddRoomDto } from './dto';
import { IHotelAnswer, IRoomAnswer, UpdateHotelParams } from './interfaces';
import { HotelsRoomService } from './hotels-room.service';
import { multerOptions } from './config/multer.config';

@Controller('api')
export class HotelsController {
  constructor(
    private hotelService: HotelsService,
    private roomServise: HotelsRoomService,
  ) {}

  @Roles(Role.Admin)
  @Post('admin/hotels')
  async createHotel(
    @Body() createHotel: AddHotelDto,
  ): Promise<Partial<IHotelAnswer>> {
    const result = await this.hotelService.create(createHotel);
    return {
      id: result._id,
      title: result.title,
      description: result.description,
    };
  }

  @Roles(Role.Admin)
  @Get('admin/hotels')
  async getAllHotels(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Partial<IHotelAnswer[]> | null> {
    const result = await this.hotelService.search({
      limit: limit,
      offset: offset,
    });
    return result
      ? result.map((obj) => {
          return {
            id: obj._id,
            title: obj.title,
            description: obj.description,
          };
        })
      : null;
  }

  @Roles(Role.Admin)
  @Put('admin/hotels/:id')
  async updateHotel(
    @Param('id') id: string | ObjectId,
    @Body() hotelToUpdate: UpdateHotelParams,
  ): Promise<Partial<IHotelAnswer>> {
    const result = await this.hotelService.update(id, hotelToUpdate);
    return {
      id: result._id,
      title: result.title,
      description: result.description,
    };
  }

  @Roles(Role.Admin)
  @Post('admin/hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async addHotelRoom(
    @Body() createRoom: AddRoomDto,
    @UploadedFiles()
    files?: Array<Express.Multer.File>,
  ): Promise<Partial<IRoomAnswer>> {
    const hotel = await this.hotelService.findById(createRoom.hotelId);

    let dowloadImages: string[] = [];
    if (files) {
      dowloadImages = files.map((file) => {
        return file.filename;
      });
    }
    const room = await this.roomServise.create({
      hotel: hotel,
      description: createRoom.description,
      images: dowloadImages,
    });
    return {
      id: room._id,
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: room.hotel._id,
        title: room.hotel.title,
        description: room.hotel.description,
      },
    };
  }

  @Public()
  @Get('common/hotel-rooms/:id')
  async getRoom(
    @Param('id') id: string | ObjectId,
  ): Promise<Partial<IRoomAnswer>> {
    const room = await this.roomServise.findById(id);
    const hotel = await this.hotelService.findById(room.hotel._id);
    return {
      id: room._id,
      description: room.description,
      images: room.images,
      hotel: {
        id: room.hotel._id,
        title: hotel.title,
        description: hotel.description,
      },
    };
  }

  @Roles(Role.Admin)
  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async updateHotelRoom(
    @Param('id') id: string | ObjectId,
    @Body() createRoom: AddRoomDto,
    @UploadedFiles()
    files?: Array<Express.Multer.File>,
  ): Promise<Partial<IRoomAnswer>> {
    const room = await this.roomServise.findById(id);
    const hotel = await this.hotelService.findById(createRoom.hotelId);
    const initialImages = room.images;
    let savedImages: string[] | undefined = [];
    if (typeof createRoom.images === 'string') {
      savedImages.push(createRoom.images);
    } else {
      savedImages = createRoom.images;
    }

    this.roomServise.updateFiles(initialImages, savedImages);
    let dowloadImages: string[] = [];
    if (files) {
      dowloadImages = files.map((file) => {
        return file.filename;
      });
    }
    const updatedRoom = await this.roomServise.update(id, {
      hotel: hotel,
      description: createRoom.description,
      images: savedImages ? savedImages.concat(dowloadImages) : dowloadImages,
      isEnabled: createRoom.isEnabled ? createRoom.isEnabled : room.isEnabled,
    });
    return {
      id: updatedRoom._id,
      description: updatedRoom.description,
      images: updatedRoom.images,
      isEnabled: updatedRoom.isEnabled,
      hotel: {
        id: updatedRoom.hotel._id,
        title: hotel.title,
        description: hotel.description,
      },
    };
  }
}
