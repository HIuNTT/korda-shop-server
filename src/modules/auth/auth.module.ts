import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ISecurityConfig, securityRegToken } from '#/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { TokenService } from './services/token.service';
import { AuthGoogleService } from './services/auth-google.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const { jwtExpire, jwtSecret } = configService.get<ISecurityConfig>(securityRegToken);
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpire,
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AuthGoogleService],
})
export class AuthModule {}
