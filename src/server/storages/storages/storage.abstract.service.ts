import { Sequelize, } from 'sequelize-typescript';

import { File, } from '../../files';
import { AbstractStorageConfig, } from './storage.abstract.config';

export abstract class AbstractStorage {
  public enabled = false;

  constructor(public readonly config: AbstractStorageConfig) {
    if (config.enabled) {
      this.enabled = true;
    } else {
      console.warn(`${this.constructor.name} disabled`);
    }
  }

  abstract init(db: Sequelize): Promise<void>;

  abstract close(): Promise<void>;

  abstract saveFile(file: File, data: Buffer): Promise<void>;

  abstract loadFile(file: File): Promise<Buffer>;

  abstract deleteFile(file: File): Promise<void>;
}
