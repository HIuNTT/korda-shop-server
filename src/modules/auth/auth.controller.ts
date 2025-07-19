import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGoogleService } from './services/auth-google.service';
import { AuthGoogleDto, LoginDto, RefreshTokenDto, SignUpDto } from './dto/auth.dto';
import { AuthToken, Tokens } from './interfaces/auth.interface';
import { TokenService } from './services/token.service';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
    private readonly tokenService: TokenService,
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

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto): Promise<AuthToken> {
    console.log('Sign up', dto);

    return await this.authService.signUp(dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<Tokens> {
    return await this.tokenService.refreshToken(dto.refreshToken);
  }
}
