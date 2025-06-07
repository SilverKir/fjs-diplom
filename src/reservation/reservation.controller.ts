import {
  Body,
  Controller,
  Post,
  Request,
  Param,
  Delete,
  ForbiddenException,
  Get,
} from '@nestjs/common';
import { Roles } from 'src/auth';
import { Role } from 'src/users';
import { ReservationService } from './reservation.service';
import { AddReservationDto } from './dto/AddReservationDto';
import { IReservationAnswer } from './interfaces';

@Controller('api')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Roles(Role.Client)
  @Post('client/reservations')
  async reserveRoom(
    @Request() req,
    @Body() data: AddReservationDto,
  ): Promise<IReservationAnswer> {
    const room = await this.reservationService.findRoomById(data.hotelRoom);
    const hotel = await this.reservationService.findHotelById(room.hotel._id);
    const userId = req.user._id as string;
    const reservation = await this.reservationService.addReservation({
      userId: userId,
      hotelId: hotel._id,
      roomId: room._id,
      dateStart: new Date(data.startDate),
      dateEnd: new Date(data.endDate),
    });
    return {
      startDate: reservation.dateStart.toISOString(),
      endDate: reservation.dateEnd.toISOString(),
      hotelRoom: {
        description: room.description,
        images: room.images,
      },
      hotel: {
        title: hotel.title,
        description: hotel.description,
      },
    };
  }

  @Roles(Role.Client)
  @Get('client/reservations')
  async getReservations(@Request() req): Promise<IReservationAnswer[]> {
    const userId = req.user._id as string;
    const reservations = await this.reservationService.getReservations({
      userId: userId,
      dateStart: new Date(-8640000000000000),
      dateEnd: new Date(8640000000000000),
    });
    if (reservations.length > 0) {
      return reservations.map((obj) => {
        return {
          startDate: obj.dateStart.toISOString(),
          endDate: obj.dateEnd.toISOString(),
          hotelRoom: {
            description: obj.roomId.description,
            images: obj.roomId.images,
          },
          hotel: {
            title: obj.hotelId.title,
            description: obj.hotelId.description,
          },
        };
      });
    }
    return [];
  }

  @Roles(Role.Client)
  @Delete('client/reservations/:id')
  async deleteReservation(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = req.user._id as string;
    const reservation = await this.reservationService.findReservationById(id);
    if (String(reservation.userId) !== String(userId)) {
      throw new ForbiddenException('Wrong user');
    }
    await this.reservationService.removeReservation(id);
  }

  @Roles(Role.Manager)
  @Get('manager/reservations/:userId')
  async getUserReservations(
    @Param('userId') userId: string,
  ): Promise<IReservationAnswer[]> {
    const reservations = await this.reservationService.getReservations({
      userId: userId,
      dateStart: new Date(-8640000000000000),
      dateEnd: new Date(8640000000000000),
    });
    if (reservations.length > 0) {
      return reservations.map((obj) => {
        return {
          startDate: obj.dateStart.toISOString(),
          endDate: obj.dateEnd.toISOString(),
          hotelRoom: {
            description: obj.roomId.description,
            images: obj.roomId.images,
          },
          hotel: {
            title: obj.hotelId.title,
            description: obj.hotelId.description,
          },
        };
      });
    }
    return [];
  }

  @Roles(Role.Manager)
  @Delete('manager/reservations/:id')
  async deleteUserReservation(@Param('id') id: string): Promise<void> {
    await this.reservationService.removeReservation(id);
  }
}
