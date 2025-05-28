import { Controller } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('api')
export class UsersController {
  constructor(private servise: UsersService) {}
}
