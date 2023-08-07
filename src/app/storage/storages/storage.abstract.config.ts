import { Inject, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { StorageParam, } from './storage.interface';

export class AbstractStorageConfig implements StorageParam {
  public enabled: boolean;
  public fileSizeLimit: number;
  public capacity: number;

  constructor(@Inject(ConfigService) protected readonly configService: ConfigService) {
    const prefix = this.constructor.name.slice(0, -6).toUpperCase();
    this.enabled = true;
    this.fileSizeLimit = configService.get<number>(`${prefix}_FILESIZE_LIMIT`) || undefined;
    this.capacity = configService.get<number>(`${prefix}_CAPACITY`) || undefined;
  }
}
