import { Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId, Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Hotel, HotelSchema, HotelRoom, RoomDocument } from '../hotels/models';
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
    @InjectConnection()
    private connection: Connection,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const room = await this.hotelRoomModel
      .findById(data.roomId)
      .select('-__v')
      .exec();
    if (!room || !room.isEnabled) {
      throw new BadRequestException('Wrong ID');
    }
    const reservation = await this.reservationModel
      .find({
        $and: [
          { roomId: data.roomId },
          { dateStart: { $lte: data.dateEnd } },
          { dateEnd: { $gte: data.dateStart } },
        ],
      })
      .exec();
    if (reservation) {
      throw new BadRequestException('Already taken');
    }
    return await this.reservationModel.create(data);
  }

  async removeReservation(id: ObjectId | string): Promise<void> {
    await this.reservationModel.deleteOne({ _id: id }).catch(() => {
      throw new BadRequestException('Wrong ID');
    });
  }

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    throw new Error('Method not implemented.');
  }
}
