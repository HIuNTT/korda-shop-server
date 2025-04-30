import { IsNotEmpty } from 'class-validator';

export class AuthGoogleDto {
  @IsNotEmpty()
  code: string;
}

export class LoginDto {
  @IsNotEmpty()
  credential: string;

  @IsNotEmpty()
  password: string;
}
