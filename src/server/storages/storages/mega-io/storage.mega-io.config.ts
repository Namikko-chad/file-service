import { StorageOpts, } from 'megajs';

import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

export class MegaIOConfig extends AbstractStorageConfig implements StorageOpts, StorageParam {
  private readonly _email?: string;
  private readonly _password?: string;

  constructor() {
    super();
    this._email = process.env['MEGAIO_USERNAME'];
    this._password = process.env['MEGAIO_PASSWORD'];
    this.enabled = !!this._email && !!this._password;
    this.fileSizeLimit = this.fileSizeLimit ?? (5 * 1024 + 120) * 1024 * 1024;
    this.capacity = this.capacity ?? (5 * 1024 + 120) * 1024 * 1024;
  }

  get email(): string {
    return this._email as string;
  }

  get password(): string {
    return this._password as string;
  }
}
