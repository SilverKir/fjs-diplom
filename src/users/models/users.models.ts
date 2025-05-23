import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IUser } from '../interfaces';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  contactPhone: string;

  @Prop({
    required: true,
    enum: ['client', 'admin', 'manager'],
    default: 'client',
  })
  role: string;
}

export const UserShema = SchemaFactory.createForClass(User);
