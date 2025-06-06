import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Hotel, HotelRoom } from 'src/hotels/models';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  _id: ObjectId | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
  hotelId: Hotel;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRoom',
    required: true,
  })
  roomId: HotelRoom;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
