import { IProvider } from '#/constants/provider.constant';

export class UserDto {
  email?: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  provider?: IProvider;
  password?: string;
  isActived?: boolean;
}
