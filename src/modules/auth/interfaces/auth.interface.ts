import { UserEntity } from '#/modules/user/entities/user.entity';

export class AuthToken {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}
