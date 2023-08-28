import { Logger, } from '@nestjs/common';

import { File, } from '../../files/entity';
import { AbstractStorageConfig, } from './storage.abstract.config';

export abstract class AbstractStorage {
  protected readonly _logger = new Logger(`Storage:${this.constructor.name}`);
  public enabled = false;

  constructor(public readonly config: AbstractStorageConfig) {
    if (config.enabled) {
      this.enabled = true;
    } else {
      this._logger.warn(`${this.constructor.name} disabled`);
    }
  }

  abstract init(): Promise<void>;

  abstract saveFile(file: File, data: Buffer): Promise<void>;

  abstract loadFile(file: File): Promise<Buffer>;

  abstract deleteFile(file: File): Promise<void>;
}
