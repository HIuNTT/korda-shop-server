import { GoogleConfig, IGoogleConfig } from '#/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthGoogleDto } from '../dto/auth.dto';
import { ISocial } from '../interfaces/social.interface';

@Injectable()
export class AuthGoogleService {
  private oAuth2Client: OAuth2Client;

  constructor(@Inject(GoogleConfig.KEY) private googleConfig: IGoogleConfig) {
    this.oAuth2Client = new OAuth2Client(
      googleConfig.clientId,
      googleConfig.clientSecret,
      'postmessage',
    );
  }

  async getProfileGoogle({ code }: AuthGoogleDto): Promise<ISocial> {
    const {
      tokens: { id_token },
    } = await this.oAuth2Client.getToken(code);

    if (!id_token) {
      throw new BadRequestException('Có lỗi xảy ra');
    }

    console.log('id_token', id_token);

    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: id_token,
      audience: this.googleConfig.clientId,
    });

    const data = ticket.getPayload();
    console.log('data', data);

    if (!data) {
      throw new BadRequestException('Có lỗi xảy ra');
    }

    return {
      email: data.email,
      name: data.name,
      avatarUrl: data.picture,
    };
  }
}
