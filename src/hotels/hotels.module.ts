import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

import { Hotel, HotelSchema, HotelRoom, HotelRoomSchema } from './models';
import { HotelsRoomService } from './hotels-room.service';
import { multerConfig } from './config/multer.config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    MulterModule.register({ dest: multerConfig.dest }),
    AuthModule,
  ],
  controllers: [HotelsController],
  providers: [HotelsService, HotelsRoomService],
})
export class HotelsModule {}
