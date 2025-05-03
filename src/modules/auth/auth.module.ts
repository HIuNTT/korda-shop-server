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
import { VerificationController } from './controllers/verification.controller';
import { VerificationService } from './services/verification.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    PassportModule,
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
  controllers: [AuthController, VerificationController],
  providers: [AuthService, TokenService, AuthGoogleService, VerificationService, JwtStrategy],
})
export class AuthModule {}
