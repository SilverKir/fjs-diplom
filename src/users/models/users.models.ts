import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

import { IUser } from '../interfaces';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  _id: ObjectId | string;

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

  constructor(data: IUser) {
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.name = data.name;
    this.contactPhone = data.contactPhone || '';
    this.role = data.role;
  }
}
export const UserShema = SchemaFactory.createForClass(User);
