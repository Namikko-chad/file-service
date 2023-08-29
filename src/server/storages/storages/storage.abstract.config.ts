
import { StorageParam, } from './storage.interface';

export class AbstractStorageConfig implements StorageParam {
  public enabled: boolean;
  public fileSizeLimit: number;
  public capacity: number;

  constructor() {
    const prefix = this.constructor.name.slice(0, -6).toUpperCase();
    this.enabled = true;
    this.fileSizeLimit = Number(process.env[`${prefix}_FILESIZE_LIMIT`]);
    this.capacity = Number(process.env[`${prefix}_CAPACITY`]);
  }
}
