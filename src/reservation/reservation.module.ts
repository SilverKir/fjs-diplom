import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationSchema } from './reservation.model';
import {
  Hotel,
  HotelSchema,
  HotelRoom,
  HotelRoomSchema,
} from '../hotels/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
