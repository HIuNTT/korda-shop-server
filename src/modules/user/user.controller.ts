import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Exists } from './interfaces/user.interface';
import { UserExistDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('exist')
  @HttpCode(HttpStatus.OK)
  async checkEmailExists(@Body() dto: UserExistDto): Promise<Exists> {
    return await this.userService.checkEmailExists(dto.email);
  }
}
