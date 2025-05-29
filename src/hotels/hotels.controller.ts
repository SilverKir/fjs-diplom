import { Body, Controller, Post } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { Roles } from 'src/auth';
import { Role } from 'src/users';
import { AddHotelDto } from './dto/AddHotelDto';
import { IHotelAnswer } from './interfaces';

@Controller('api')
export class HotelsController {
  constructor(private hotelService: HotelsService) {}

  @Roles(Role.Admin)
  @Post('admin/hotels')
  async create(
    @Body() createHotel: AddHotelDto,
  ): Promise<Partial<IHotelAnswer>> {
    const result = await this.hotelService.create(createHotel);
    return {
      id: result._id,
      title: result.title,
      description: result.description,
    };
  }
}
