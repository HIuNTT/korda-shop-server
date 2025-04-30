import { ISecurityConfig, SecurityConfig } from '#/config';
import { RoleType } from '#/constants/role.constant';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { UserEntity } from '#/modules/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async generateTokens(uid: number, role: RoleType) {
    console.log(dayjs('2025-04-26T14:08:50.551Z').format('YYYY-MM-DD HH:mm:ss'));

    const payload: IAuthUser = { uid, role };

    const accessTokenSign = await this.jwtService.signAsync(payload);
    const refreshTokenSign = await this.jwtService.signAsync(payload, {
      secret: this.securityConfig.refreshSecret,
      expiresIn: this.securityConfig.refreshExpire,
    });

    const refreshToken = new RefreshTokenEntity();
    refreshToken.value = refreshTokenSign;
    refreshToken.user = { id: uid } as UserEntity;
    refreshToken.expiredAt = dayjs()
      .add(parseInt(this.securityConfig.refreshExpire, 10), 'day')
      .toDate();

    const u = await refreshToken.save();
    console.log('u:', u);

    return {
      accessToken: accessTokenSign,
      refreshToken: refreshTokenSign,
    };
  }
}
