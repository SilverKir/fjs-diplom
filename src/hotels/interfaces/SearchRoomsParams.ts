import { ObjectId } from 'mongoose';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: string | ObjectId;
  isEnabled?: boolean;
}
