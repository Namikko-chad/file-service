import { Inject, Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { FileServiceConfig, } from './interfaces';

@Injectable()
export class FileServiceConnectorConfig implements FileServiceConfig {
  public readonly apiUrl: URL;
  public readonly file: {
    readonly expired: number;
    readonly secret: string;
  };
  public readonly user: {
    readonly expired: number;
    readonly secret: string;
  };
  public readonly admin: {
    readonly expired: number;
    readonly secret: string;
  };

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    let apiUrl = this.config.get<string>('FILE_SERVICE_URL') || 'localhost:3050';
    apiUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    this.apiUrl = new URL(apiUrl);
    this.file = {
      secret: this.config.getOrThrow<string>('FA_SECRET'),
      expired: this.config.get<number>('FA_LIFETIME') || 900000,
    };
    this.user = {
      secret: this.config.getOrThrow<string>('UA_SECRET'),
      expired: this.config.get<number>('UA_LIFETIME') || 60 * 60 * 24 * 3 * 1000, /* 3 days */
    };
    this.admin = {
      secret: this.config.getOrThrow<string>('AA_SECRET'),
      expired: this.config.get<number>('AA_LIFETIME') || 60 * 60 * 24 * 3 * 1000, /* 3 days */
    };
  }
}