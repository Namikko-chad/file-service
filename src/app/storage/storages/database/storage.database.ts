import { Inject, } from '@nestjs/common';

import { File, } from '../../../files/entity';
import { StorageType, } from '../../storage.enum';
import { AbstractStorage, } from '../storage.abstract';
import { StorageRepository, } from './storage.repository';

export class DBStorage extends AbstractStorage {
  constructor(@Inject(StorageRepository) private readonly _storageRepository: StorageRepository) {
    super();
  }

  params = {
    fileSizeLimit: 1024 * 1024 * 30,
  };
  type = StorageType.DB;

  async saveFile(file: File, data: Buffer): Promise<void> {
    const storage = this._storageRepository.create();
    storage.data = data;
    storage.id = file.id;
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
