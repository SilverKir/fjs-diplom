import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChatModule } from './chat/chat.module';
import { NavModule } from './navigate/navigate.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? 'mongodb://localhost:27017/hotel_reservaton',
    ),
    AuthModule,
    HotelsModule,
    ReservationModule,
    ChatModule,
    NavModule,
  ],
})
export class AppModule {}
