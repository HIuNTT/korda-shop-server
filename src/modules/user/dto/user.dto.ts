import { IProvider } from '#/constants/provider.constant';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  email?: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  provider?: IProvider;
  password?: string;
  isActived?: boolean;
}

export class UserExistDto {
  @IsNotEmpty()
  email: string;
}
