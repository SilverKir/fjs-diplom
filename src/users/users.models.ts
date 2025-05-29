import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { IUser } from './interfaces';
import { Role } from './users.roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
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
    enum: Object.values(Role),
    default: Role.Client,
  })
  role: string;

  constructor(data: IUser) {
    this.email = data.email;
    this.passwordHash = bcrypt.hashSync(data.password, 10);
    this.name = data.name;
    this.contactPhone = data.contactPhone || '';
    this.role = data.role || Role.Client;
  }
}
export const UserSchema = SchemaFactory.createForClass(User);
