import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

export class DatabaseConfig extends AbstractStorageConfig implements StorageParam {

  constructor() {
    super();
    this.fileSizeLimit = Number(process.env['DATABASE_FILESIZE_LIMIT']) ?? (5 * 1024 + 120) * 1024 * 1024;
    this.capacity = Number(process.env['DATABASE_CAPACITY']) ?? (5 * 1024 + 120) * 1024 * 1024;
  }
}
