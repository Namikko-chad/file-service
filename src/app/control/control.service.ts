import { Inject, Injectable, } from '@nestjs/common';

import { FileRepository, } from 'app/files/repositories';
import { StorageService, } from 'app/storage/storage.service';

@Injectable()
export class ControlService {
  private readonly _storage: StorageService;
  @Inject(FileRepository)
  private readonly _fileRepository: FileRepository;

  async flushStorage(storageType: string): Promise<void> {
    const files = await this._fileRepository.findBy({
      storage: storageType,
    });
    await Promise.all(
      files.map( file => this._storage.deleteFile(file.id) )
    );
  }
}
