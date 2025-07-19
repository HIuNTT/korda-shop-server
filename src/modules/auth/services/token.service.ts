import { ISecurityConfig, SecurityConfig } from '#/config';
import { RoleType } from '#/constants/role.constant';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '#/modules/user/entities/user.entity';
import { Tokens } from '../interfaces/auth.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async generateTokens(uid: number, role: RoleType): Promise<Tokens> {
    const payload: IAuthUser = { uid, role };

    const accessTokenSign = await this.jwtService.signAsync(payload);
    const refreshTokenSign = await this.jwtService.signAsync(payload, {
      secret: this.securityConfig.refreshSecret,
      expiresIn: this.securityConfig.refreshExpire,
    });

    const refreshToken = new RefreshToken();
    refreshToken.value = refreshTokenSign;
    refreshToken.user = { id: uid } as User;
    refreshToken.expiredAt = dayjs()
      .add(parseInt(this.securityConfig.refreshExpire, 10), 'day')
      .toDate();

    const u = await refreshToken.save();

    return {
      accessToken: accessTokenSign,
      refreshToken: refreshTokenSign,
    };
  }

  /** Làm mới token */
  async refreshToken(value: string): Promise<Tokens> {
    try {
      const authUser = await this.verifyRefreshToken(value);
      const refreshToken = await RefreshToken.findOne({ where: { value } });

      if (!refreshToken) throw new UnauthorizedException('Vui lòng đăng nhập lại!');

      const tokens = await this.generateTokens(authUser.uid, authUser.role as RoleType);
      await refreshToken.remove();

      return new Tokens(tokens);
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Vui lòng đăng nhập lại!');
      }
    }
  }

  async removeRefreshToken(value: string) {
    const refreshToken = await RefreshToken.findOne({ where: { value } });
    if (refreshToken) {
      await refreshToken.remove();
    }
  }

  async verifyRefreshToken(token: string): Promise<IAuthUser> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.securityConfig.refreshSecret,
    });
  }
}
