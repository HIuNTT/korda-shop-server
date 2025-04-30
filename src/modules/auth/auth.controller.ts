import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGoogleService } from './services/auth-google.service';
import { AuthGoogleDto, LoginDto } from './dto/auth-google.dto';
import { AuthToken } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Post('user/google')
  async googleAuth(@Body() dto: AuthGoogleDto): Promise<AuthToken> {
    const socialProfile = await this.authGoogleService.getProfileGoogle(dto);
    return await this.authService.validateSocialUser('google', socialProfile);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthToken> {
    return await this.authService.validateLoginUser(dto);
  }
}
