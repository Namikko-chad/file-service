import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { StorageOpts, } from 'megajs';

import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

@Injectable()
export class MegaIOConfig extends AbstractStorageConfig implements StorageOpts, StorageParam {
  private readonly _email: string;
  private readonly _password: string;

  constructor(configService: ConfigService) {
    super(configService);
    this._email = configService.get<string>('MEGAIO_USERNAME');
    this._password = configService.get<string>('MEGAIO_PASSWORD');
    this.enabled = !!this._email && !!this._password;
    this.fileSizeLimit = this.fileSizeLimit ?? 10 * 1024 * 1024;
    this.capacity = this.capacity ?? (5 * 1024 + 120) * 1024 * 1024;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }
}
