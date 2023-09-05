import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import * as fs from 'fs';

import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

@Injectable()
export class GoogleDriveConfig extends AbstractStorageConfig implements StorageParam {
  private readonly _keyFileName: string;

  constructor(configService: ConfigService) {
    super(configService);
    this._keyFileName = configService.get<string>('GOOGLEDRIVE_KEY') || 'google-auth-key.json';
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    this.enabled = fs.existsSync(this._keyFileName);
    this.fileSizeLimit = this.fileSizeLimit ?? 10 * 1024 * 1024;
    this.capacity = this.capacity ?? (5 * 1024 + 120) * 1024 * 1024;
  }

  get keyFileName(): string {
    return this._keyFileName;
  }
}
