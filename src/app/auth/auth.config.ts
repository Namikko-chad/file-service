import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

interface JwtTokenInterface {
  secret: string;
}

export interface JwtAuthInterface {
  file: JwtTokenInterface;
  user: JwtTokenInterface;
  admin: JwtTokenInterface;
}

@Injectable()
export class AuthConfig {
  /** JWT auth secrets */
  public jwt: JwtAuthInterface;

  constructor(private readonly configService: ConfigService) {
    this.jwt = {
      file: {
        secret: this.configService.getOrThrow<string>('FA_SECRET'),
      },
      user: {
        secret: this.configService.getOrThrow<string>('UA_SECRET'),
      },
      admin: {
        secret: this.configService.getOrThrow<string>('AA_SECRET'),
      },
    };
  }
}
