import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  _id: ObjectId | string;

  @Prop({ required: true })
  userId: ObjectId | string;

  @Prop({ required: true })
  hotelId: ObjectId | string;

  @Prop({ required: true })
  roomId: ObjectId | string;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
