import { User } from '#/modules/user/entities/user.entity';
import { Expose } from 'class-transformer';

export class AuthToken {
  user: User;

  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  constructor(partial: Partial<AuthToken>) {
    Object.assign(this, partial);
  }
}

export class Tokens {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  constructor(partial: Partial<Tokens>) {
    Object.assign(this, partial);
  }
}
