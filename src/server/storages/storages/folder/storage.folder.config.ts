import * as fs from 'fs';

import { AbstractStorageConfig, } from '../storage.abstract.config';
import { StorageParam, } from '../storage.interface';

export class FolderConfig extends AbstractStorageConfig implements StorageParam {
  public readonly filesDir: string;

  constructor() {
    super();
    this.filesDir = process.env['FOLDER_PATH'] || 'assert';
    fs.access(this.filesDir, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        this.enabled = false;
      }
    });
    this.fileSizeLimit = this.fileSizeLimit ?? 4 * 1024 * 1024 * 1024;
    this.capacity = this.capacity ?? 50 * 1024 * 1024 * 1024;
  }
}
