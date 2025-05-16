import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

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

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose({ name: 'full_name' })
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;
}

export class SendEmailCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyEmailCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}

export class LogoutDto {
  @Expose({ name: 'refresh_token' })
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenDto extends LogoutDto {}
