import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChatModule } from './chat/chat.module';
import { NavModule } from './navigate/navigate.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? 'mongodb://localhost:27017/hotel_reservaton',
    ),
    EventEmitterModule.forRoot(),
    AuthModule,
    HotelsModule,
    ReservationModule,
    ChatModule,
    NavModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../uploads/', 'images'),
      serveRoot: '/api/images',
    }),
  ],
})
export class AppModule {}
