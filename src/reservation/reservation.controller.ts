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

  /**
   * резервирование клиентом комнаты
   * @param req
   * @param data
   * @returns  параметры зарезервированной комнаты
   */
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
      hotelId: hotel,
      roomId: room,
      dateStart: new Date(data.startDate),
      dateEnd: new Date(data.endDate),
    });
    return {
      startDate: reservation.dateStart.toISOString(),
      endDate: reservation.dateEnd.toISOString(),
      hotelRoom: {
        description: reservation.roomId.description,
        images: reservation.roomId.images,
      },
      hotel: {
        title: reservation.hotelId.title,
        description: reservation.hotelId.description,
      },
    };
  }

  /**
   * получение клиентом списка зарегистрированных комнат
   * @param req
   * @returns список зарегистрированиих комнат
   */
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
      return await Promise.all(
        reservations.map(async (obj) => {
          const room = await this.reservationService.findRoomById(
            obj.roomId._id.toString(),
          );
          const hotel = await this.reservationService.findHotelById(
            room.hotel._id,
          );
          return {
            id: obj._id,
            startDate: obj.dateStart.toISOString(),
            endDate: obj.dateEnd.toISOString(),
            hotelRoom: {
              description: room.description,
              images: room.images,
            },
            hotel: {
              title: hotel.title,
              description: hotel.description,
            },
          };
        }),
      );
    }
    return [];
  }

  /**
   * удаление клиентом ранее рарезервированной комнаты
   * @param req
   * @param id
   */
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

  /**
   * получение менеджером списка комнат, зарезервированных пользователем
   * @param userId
   * @returns
   */
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
      return await Promise.all(
        reservations.map(async (obj) => {
          const room = await this.reservationService.findRoomById(
            obj.roomId._id.toString(),
          );
          const hotel = await this.reservationService.findHotelById(
            room.hotel._id,
          );
          return {
            id: obj._id,
            startDate: obj.dateStart.toISOString(),
            endDate: obj.dateEnd.toISOString(),
            hotelRoom: {
              description: room.description,
              images: room.images,
            },
            hotel: {
              title: hotel.title,
              description: hotel.description,
            },
          };
        }),
      );
    }
    return [];
  }

  /**
   * удаление менеджером зарезервированных клиентом комнат
   * @param id - ID зарезервированной комнаты
   */
  @Roles(Role.Manager)
  @Delete('manager/reservations/:id')
  async deleteUserReservation(@Param('id') id: string): Promise<void> {
    await this.reservationService.removeReservation(id);
  }
}
