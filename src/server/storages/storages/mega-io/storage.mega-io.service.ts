import { Storage as MegaStorage, } from 'megajs';
import { Sequelize, } from 'sequelize-typescript';

import { File, } from '../../../files';
import { Exception, } from '../../../utils';
import { StoragesErrors, StoragesErrorsMessages, } from '../../storages.errors';
import { AbstractStorage, } from '../storage.abstract.service';
import { MegaIOConfig, } from './storage.mega-io.config';

export class MegaIOStorage extends AbstractStorage {
  public storage: MegaStorage;
  override config: MegaIOConfig;

  constructor() {
    const config = new MegaIOConfig();
    super(config);
    this.config = config;
    this.storage = new MegaStorage({
      email: this.config.email,
      password: this.config.password,
    });
  }

  override async init(_db: Sequelize): Promise<void> {
    if (this.enabled) {
      const storage = this.storage.ready;

      this.storage = await storage;
    }
  }

  override async close(): Promise<void> {
    if (this.enabled) {
      await this.storage.close();
    }
  }

  async saveFile({ id: fileId, }: File, data: Buffer): Promise<void> {
    await this.storage.upload(fileId, data).complete;
  }

  async loadFile({ id: fileId, }: File): Promise<Buffer> {
    const file = this.storage.root.children?.find( file => file.name === fileId );
    if (!file)
      throw new Exception(StoragesErrors.FileNotFound, StoragesErrorsMessages[StoragesErrors.FileNotFound]);
    const buffer = await file.downloadBuffer({});

    return buffer;
  }

  async deleteFile({ id: fileId, }: File): Promise<void> {
    const file = this.storage.root.children?.find( file => file.name === fileId );
    if (!file)
      throw new Exception(StoragesErrors.FileNotFound, StoragesErrorsMessages[StoragesErrors.FileNotFound]);
    await file.delete(true);
  }
}
