import { Inject, } from '@nestjs/common';

import { File, } from '../../../files/entity';
import { AbstractStorage, } from '../storage.abstract.service';
import { DatabaseConfig, } from './storage.database.config';
import { StorageRepository, } from './storage.database.repository';

export class DBStorage extends AbstractStorage {

  constructor(
    @Inject(StorageRepository) private readonly _storageRepository: StorageRepository,
    @Inject(DatabaseConfig) config: DatabaseConfig) {
    super(config);
  }

  override init(): Promise<void> {
    return Promise.resolve();
  }

  override close(): Promise<void> {
    return Promise.resolve();
  }

  async saveFile(file: File, data: Buffer): Promise<void> {
    const storage = this._storageRepository.create({
      data,
      id: file.id,
    });
    await this._storageRepository.save(storage);
  }

  async loadFile(file: File): Promise<Buffer> {
    const storage = await this._storageRepository.findOneBy({
      id: file.id,
    });

    return storage.data;
  }

  async deleteFile(file: File): Promise<void> {
    await this._storageRepository.delete({
      id: file.id,
    });
  }
}
