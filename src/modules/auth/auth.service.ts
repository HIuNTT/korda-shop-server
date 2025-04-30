import { IProvider } from '#/constants/provider.constant';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ISocial } from './interfaces/social.interface';
import { UserService } from '../user/user.service';
import { RoleType } from '#/constants/role.constant';
import { AuthToken } from './interfaces/auth.interface';
import { TokenService } from './services/token.service';
import { LoginDto } from './dto/auth-google.dto';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
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
      console.log('User created:', user);
    }

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(
      user.id,
      user.role as RoleType,
    );

    delete user.password; // Remove password from user object

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async validateLoginUser({ credential, password }: LoginDto) {
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

    delete user.password; // Remove password from user object

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
