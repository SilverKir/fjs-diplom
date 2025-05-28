import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? 'mongodb://localhost:27017/hotel_reservaton',
    ),
    AuthModule,
  ],
})
export class AppModule {}
