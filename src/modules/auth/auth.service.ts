import { IProvider } from '#/constants/provider.constant';
import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ISocial } from './interfaces/social.interface';
import { UserService } from '../user/user.service';
import { RoleType } from '#/constants/role.constant';
import { AuthToken } from './interfaces/auth.interface';
import { TokenService } from './services/token.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { InjectRedis } from '#/common/decorators/inject-redis.decorator';
import Redis from 'ioredis';
import { genTokenBlacklistKey, genVerifiedEmailKey } from '#/helper/genRedisKey';
import { ISecurityConfig, SecurityConfig } from '#/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    @InjectRedis() private readonly redis: Redis,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async validateSocialUser(authProvider: IProvider, profile: ISocial): Promise<AuthToken> {
    let user = await this.userService.findUserByEmail(profile.email!);

    if (!user) {
      user = await this.userService.createUser({
        email: profile.email,
        fullName: profile.name,
        avatarUrl: profile.avatarUrl,
        provider: authProvider,
        isActived: true,
      });
    }

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(
      user.id,
      user.role as RoleType,
    );

    return new AuthToken({
      user,
      accessToken,
      refreshToken,
    });
  }

  async validateLoginUser({ credential, password }: LoginDto): Promise<AuthToken> {
    const isEmail = credential.includes('@');

    const user = isEmail
      ? await this.userService.findUserByEmail(credential)
      : await this.userService.findUserByPhone(credential);
    if (isEmpty(user)) {
      throw new UnprocessableEntityException('Sai thông tin đăng nhập');
    }

    if (isEmpty(user.password)) {
      throw new UnprocessableEntityException(`Hãy đăng nhập bằng tài khoản ${user.provider}`);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException('Sai thông tin đăng nhập');
    }

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(
      user.id,
      user.role as RoleType,
    );

    return new AuthToken({
      user,
      accessToken,
      refreshToken,
    });
  }

  async signUp({ email, fullName, password }: SignUpDto): Promise<AuthToken> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new UnprocessableEntityException('Email đã tồn tại');
    }

    const isVefiedEmail = await this.redis.get(genVerifiedEmailKey(email));
    if (!Boolean(JSON.parse(isVefiedEmail))) {
      throw new UnprocessableEntityException('Email chưa được xác thực');
    }

    const newUser = await this.userService.createUser({
      email,
      fullName,
      password,
      isActived: true,
    });

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(
      newUser.id,
      newUser.role as RoleType,
    );

    await this.redis.del(genVerifiedEmailKey(email));

    return new AuthToken({
      user: newUser,
      accessToken,
      refreshToken,
    });
  }

  async logout(user: IAuthUser, accessToken: string, refreshToken: string): Promise<void> {
    const exp = user.exp
      ? (user.exp - Date.now() / 1000).toFixed(0)
      : this.securityConfig.jwtExpire;
    await this.redis.set(genTokenBlacklistKey(accessToken), accessToken, 'EX', exp);
    await this.tokenService.removeRefreshToken(refreshToken);
  }
}
