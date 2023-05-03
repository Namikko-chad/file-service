/* eslint-disable security/detect-non-literal-fs-filename */
import { Inject, } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as p from 'path';

import { File, } from '../../files/entity';
import { StorageConfig, } from '../storage.config';
import { StorageType, } from '../storage.enum';
import { AbstractStorage, } from './storage.abstract';

export class FolderStorage extends AbstractStorage {
  constructor(@Inject(StorageConfig) private readonly config: StorageConfig) {
    super();
  }

  params = {
    fileSizeLimit: 1024 * 1024 * 1024 * 4,
  };
  type = StorageType.FOLDER;

  async saveFile(file: File, data: Buffer): Promise<void> {
    const dirPath = p.join(this.config.filesDir);
    await fs.mkdir(dirPath, { recursive: true, });
    const fileName = `${file.id}.${file.ext}`;
    const filePath = p.join(dirPath, fileName);

    return fs.writeFile(filePath, data);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async loadFile(file: File): Promise<Buffer> {
    const filePath = p.join(this.config.filesDir, `${file.id}.${file.ext}`);

    return Buffer.from(filePath);
  }

  async deleteFile(file: File): Promise<void> {
    const filePath = p.join(this.config.filesDir, `${file.id}.${file.ext}`);

    return fs.unlink(filePath);
  }
}
