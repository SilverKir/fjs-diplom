import { Module } from '@nestjs/common';
import { NavService } from './navigate.service';

@Module({
  providers: [NavService],
  exports: [NavService],
})
export class NavModule {}
