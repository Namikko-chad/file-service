import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

@Injectable()
export class DatabaseConfig extends AbstractStorageConfig implements StorageParam {

  constructor(configService: ConfigService) {
    super(configService);
    this.enabled = true;
    this.fileSizeLimit = configService.get<number>('DATABASE_FILESIZE_LIMIT') ?? (5 * 1024 + 120) * 1024 * 1024;
    this.capacity = configService.get<number>('DATABASE_CAPACITY') ?? (5 * 1024 + 120) * 1024 * 1024;
  }
}
