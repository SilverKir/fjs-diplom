import { Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId, Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import {
  HotelRoom,
  RoomDocument,
  Hotel,
  HotelDocument,
} from '../hotels/models';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from './interfaces';
import { Reservation, ReservationDocument } from './reservation.model';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<RoomDocument>,
    @InjectModel(Hotel.name)
    private hotelModel: Model<HotelDocument>,
    @InjectConnection()
    private connection: Connection,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const reservation = await this.reservationModel
      .find({
        $and: [
          { roomId: data.roomId },
          { dateStart: { $lte: data.dateEnd } },
          { dateEnd: { $gte: data.dateStart } },
        ],
      })
      .exec();
    if (reservation.length > 0) {
      throw new BadRequestException('Already taken');
    }
    return await this.reservationModel.create(data);
  }

  async removeReservation(id: ObjectId | string): Promise<void> {
    await this.reservationModel.deleteOne({ _id: id }).catch(() => {
      throw new BadRequestException('Wrong ID');
    });
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    return await this.reservationModel
      .find({
        $and: [
          { userId: filter.userId },
          { dateStart: { $lte: filter.dateEnd } },
          { dateEnd: { $gte: filter.dateStart } },
        ],
      })
      .select('-__v')
      .exec()
      .catch(() => {
        throw new BadRequestException('Wrong request');
      });
  }

  async findReservationById(id: ObjectId | string): Promise<Reservation> {
    const result = await this.reservationModel
      .findById(id)
      .select('-__v')
      .exec()
      .catch(() => {
        throw new BadRequestException('Wrong ID');
      });

    if (result) {
      return result;
    }
    throw new BadRequestException('Wrong ID');
  }

  async findHotelById(id: ObjectId | string): Promise<Hotel> {
    const result = await this.hotelModel
      .findById(id)
      .select('-__v')
      .exec()
      .catch(() => {
        throw new BadRequestException('Wrong HotelID');
      });

    if (result) {
      return result;
    }
    throw new BadRequestException('Wrong HotelID');
  }

  async findRoomById(id: string): Promise<HotelRoom> {
    const result = await this.hotelRoomModel.findById(id).select('-__v').exec();
    if (!result || !result.isEnabled) {
      throw new BadRequestException('Wrong roomID');
    }
    return result;
  }
}
