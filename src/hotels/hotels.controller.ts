import {
  Body,
  Controller,
  Request,
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

import { Roles, Public, AuthService } from 'src/auth';
import { Role } from 'src/users';

import { HotelsService } from './hotels.service';
import { AddHotelDto, AddRoomDto } from './dto';
import { IHotelAnswer, IRoomAnswer, UpdateHotelParams } from './interfaces';
import { HotelsRoomService } from './hotels-room.service';
import { multerOptions } from './config/multer.config';
import { HotelRoom } from './models';
import { ReservationService } from 'src/reservation/reservation.service';

@Controller('api')
export class HotelsController {
  constructor(
    private authService: AuthService,
    private hotelService: HotelsService,
    private roomService: HotelsRoomService,
    private reservationService: ReservationService,
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
    const room = await this.roomService.create({
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
  @Get('common/hotel-rooms')
  async getAllHotelRooms(
    @Request() req,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('hotel') title?: string,
  ): Promise<Partial<IRoomAnswer[]> | null> {
    const role = await this.authService.getRole(req);
    const isEnabled = role === 'unauthorized' || role === 'client';
    const result = await this.hotelService.search({
      title: title,
    });

    if (result) {
      const rooms: HotelRoom[] = [];
      for (const obj of result) {
        const roomResults = await this.roomService.search({
          isEnabled: isEnabled,
          hotel: obj._id,
        });
        rooms.push(...roomResults);
      }

      if (rooms) {
        const promises = rooms.map(async (room) => {
          const hotel = await this.hotelService.findById(room.hotel._id);
          return {
            id: room._id,
            description: room.description,
            images: room.images,
            hotel: {
              id: room.hotel._id,
              title: hotel.title,
            },
          };
        });

        let reservedRoomsId: (string | ObjectId)[] = [];
        if (dateStart && dateEnd) {
          const reserved = await this.reservationService.getReservationsByDate({
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
          });
          if (reserved) {
            reservedRoomsId = reserved.map((room) => {
              return room.roomId._id;
            });
          }
        }
        const answer = await Promise.all(promises);
        const lim = limit ? limit : answer.length;
        const off = offset ? offset : 0;
        if (reservedRoomsId.length > 0) {
          const arr = answer.filter((el) => {
            return !reservedRoomsId.some((res) => {
              return res.toString() === el.id.toString();
            });
          });
          return arr.slice(off, Number(lim) + Number(off));
        }

        return answer.slice(off, Number(lim) + Number(off));
      }
      return null;
    }
    return null;
  }

  @Public()
  @Get('common/hotel-rooms/:id')
  async getRoom(
    @Param('id') id: string | ObjectId,
  ): Promise<Partial<IRoomAnswer>> {
    const room = await this.roomService.findById(id);
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
    const room = await this.roomService.findById(id);
    const hotel = await this.hotelService.findById(createRoom.hotelId);
    const initialImages = room.images;
    let savedImages: string[] | undefined = [];
    if (typeof createRoom.images === 'string') {
      savedImages.push(createRoom.images);
    } else {
      savedImages = createRoom.images;
    }

    this.roomService.updateFiles(initialImages, savedImages);
    let dowloadImages: string[] = [];
    if (files) {
      dowloadImages = files.map((file) => {
        return file.filename;
      });
    }
    const updatedRoom = await this.roomService.update(id, {
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
