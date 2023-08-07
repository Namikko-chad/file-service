import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import * as fs from 'fs';

import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

@Injectable()
export class FolderConfig extends AbstractStorageConfig implements StorageParam {
  public readonly filesDir: string;

  constructor(configService: ConfigService) {
    super(configService);
    this.filesDir = configService.get<string>('FOLDER_PATH') || 'assert';
    fs.access(this.filesDir, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        this.enabled = false;
      }
    });
    this.fileSizeLimit = this.fileSizeLimit ?? 4 * 1024 * 1024 * 1024;
    this.capacity = this.capacity ?? 50 * 1024 * 1024 * 1024;
  }
}
