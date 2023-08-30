/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs/promises';
import * as p from 'path';
import { Sequelize, } from 'sequelize-typescript';

import { File, } from '../../../files';
import { AbstractStorage, } from '../storage.abstract.service';
import { FolderConfig, } from './storage.folder.config';

export class FolderStorage extends AbstractStorage {
  private readonly filesDir: string;

  constructor() {
    const config = new FolderConfig();
    super(config);
    this.filesDir = config.filesDir;
  }

  override init(_db: Sequelize): Promise<void> {
    return Promise.resolve();
  }

  override close(): Promise<void> {
    return Promise.resolve();
  }

  async saveFile(file: File, data: Buffer): Promise<void> {
    const dirPath = p.join(this.filesDir);
    await fs.mkdir(dirPath, { recursive: true, });
    const fileName = `${file.id}.${file.ext}`;
    const filePath = p.join(dirPath, fileName);

    return fs.writeFile(filePath, data);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async loadFile(file: File): Promise<Buffer> {
    const filePath = p.join(this.filesDir, `${file.id}.${file.ext}`);

    return fs.readFile(filePath);
  }

  async deleteFile(file: File): Promise<void> {
    const filePath = p.join(this.filesDir, `${file.id}.${file.ext}`);

    return fs.unlink(filePath);
  }
}
