import { Sequelize, } from 'sequelize-typescript';

import { File, } from '../../../files';
import { AbstractStorage, } from '../storage.abstract.service';
import { DatabaseConfig, } from './storage.database.config';
import { Storage, } from './storage.database.model';

export class DBStorage extends AbstractStorage {
  override config: DatabaseConfig;

  constructor() {
    const config = new DatabaseConfig();
    super(config);
    this.config = config;
  }

  override init(db: Sequelize): Promise<void> {
    db.addModels([Storage]);

    return Promise.resolve();
  }

  override close(): Promise<void> {
    return Promise.resolve();
  }

  async saveFile(file: File, data: Buffer): Promise<void> {
    await Storage.create({
      id: file.id,
      data,
    });
  }

  async loadFile(file: File): Promise<Buffer> {
    const fileData = (await Storage.findByPk(file.id)) as Storage;

    return fileData.data;
  }

  async deleteFile(file: File): Promise<void> {
    await Storage.destroy({
      where: {
        id: file.id,
      },
    });
  }
}
