import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel {
  _id: ObjectId | string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
