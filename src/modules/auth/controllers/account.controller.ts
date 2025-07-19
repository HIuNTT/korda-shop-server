import { UserService } from '#/modules/user/user.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthUser } from '../decorators/auth-user.decorator';
import { User } from '#/modules/user/entities/user.entity';
import { Request } from 'express';
import { LogoutDto } from '../dto/auth.dto';
import { AuthService } from '../auth.service';

@Controller('account')
export class AccountController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('profile')
  async profile(@AuthUser() user: IAuthUser): Promise<User> {
    return this.userService.getAccountInfo(user.uid);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @AuthUser() user: IAuthUser,
    @Req() req: Request,
    @Body() dto: LogoutDto,
  ): Promise<void> {
    await this.authService.logout(user, req.accessToken, dto.refreshToken);
  }
}
