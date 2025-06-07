import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users';

export type MessageDocument = Message & Document;
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  _id: ObjectId | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop()
  messages: Message[];

  @Prop()
  isActive: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
