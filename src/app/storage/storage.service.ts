import { HttpStatus, Inject, Injectable, Logger, } from '@nestjs/common';
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { DataSource, In, } from 'typeorm';

import { File, } from '../files/entity';
import { FileRepository, } from '../files/repositories';
import { Exception, } from '../utils/Exception';
import { StorageConfig, } from './storage.config';
import { Errors, ErrorsMessages, } from './storage.errors';
import { FileFormData, IFilename, } from './storage.interface';
import { DBStorage, } from './storages/database/storage.database.service';
import { FolderStorage, } from './storages/folder/storage.folder.service';
import { GoogleDriveStorage, } from './storages/google-drive/storage.google-drive.service';
import { MegaIOStorage, } from './storages/mega-io/storage.mega-io.service';
import { AbstractStorage, } from './storages/storage.abstract.service';

@Injectable()
export class StorageService {
  @Inject(FileRepository) private readonly _fileRepository: FileRepository;
  @Inject(StorageConfig) private readonly config: StorageConfig;
  protected readonly _logger = new Logger(StorageService.name);
  storages: Map<string, AbstractStorage> = new Map();

  constructor(
    @Inject(DataSource) private readonly _DS: DataSource,
    @Inject(DBStorage) dbStorage: DBStorage,
    @Inject(FolderStorage) folderStorage: FolderStorage,
    @Inject(GoogleDriveStorage) googleDriveStorage: GoogleDriveStorage,
    @Inject(MegaIOStorage) megaIOStorage: MegaIOStorage
  ) {
    const storages: AbstractStorage[] = [
      dbStorage, folderStorage, googleDriveStorage,megaIOStorage
    ];
    storages.sort ( (a,b) => a.config.fileSizeLimit - b.config.fileSizeLimit ).forEach( storage => 
      this.storages.set(storage.constructor.name.slice(0, -7).toLowerCase(), storage)
    );
  }

  splitFilename(filename: string): IFilename {
    let ext = '';
    let name = filename;

    if (filename.includes('.')) {
      const parts = filename.split('.');

      if (parts.length > 1) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ext = parts[parts.length - 1].toLowerCase();
        parts.pop();
        name = filename.slice(0, filename.length - ext.length - 1);
      }
    }

    return { name, ext, };
  }

  async getExt(name: string, file: Buffer): Promise<{ ext: string; mime: string }> {
    let ext = '';
    let mime = '';

    if (Buffer.isBuffer(file)) {
      const fileExt = await fileType.fromBuffer(file);

      if (fileExt) {
        ext = fileExt.ext;
        mime = fileExt.mime;
      }
    }

    // try search in filename
    if (!ext || !mime) {
      const splitName = this.splitFilename(name);
      ext = splitName.ext;
      mime = mimeType.lookup(name) as string;
    }

    if (!ext || !mime) throw new Exception(HttpStatus.BAD_REQUEST, 'Unsupported file type');

    if (!this.config.allowedExtensionsRegExp.exec(ext)) {
      throw new Exception(HttpStatus.FORBIDDEN, 'This media file extension forbidden');
    }

    return { ext, mime, };
  }

  getHash(data: Buffer): string {
    const hash_md5 = crypto.createHash('md5');
    hash_md5.update(data);

    return hash_md5.digest('hex');
  }

  private getStorage(size: number): AbstractStorage {
    for (const [_, storage] of this.storages) {
      if (storage.config.fileSizeLimit > size && storage.enabled) {
        return storage;
      }
    }

    throw new Exception(HttpStatus.PAYLOAD_TOO_LARGE, 'File is too large');
  }

  private getStorageType(storage: AbstractStorage): string {
    return storage.constructor.name.slice(0, -7).toLowerCase();
  }

  private async loadFileInfo(fileId: string): Promise<File> {
    const file = await this._fileRepository.findOneBy({
      id: fileId,
    });

    if (!file) throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], { fileId, });

    return file;
  }

  async sizeFile(fileIds?: string[]): Promise<number> {
    const sum = await this._fileRepository.sum('size', {
      id: In(fileIds),
    });

    return sum;
  }

  async saveFile(uploadedFile: FileFormData): Promise<File> {
    const queryRunner = this._DS.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const hash = this.getHash(uploadedFile.payload);
      const { mime, ext, } = await this.getExt(uploadedFile.filename, uploadedFile.payload);
      const size = uploadedFile.payload.length;
      const storage = this.getStorage(size);
      const [file, created] = await this._fileRepository.findOrCreate(
        {
          hash,
        },
        {
          ext,
          mime,
          size,
          storage: this.getStorageType(storage),
          hash,
        }, {
          queryRunner,
        }
      );
      if (created) await storage.saveFile(file, uploadedFile.payload);
      await queryRunner.commitTransaction();

      return file;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async loadFile(fileId: string): Promise<[File, Buffer]> {
    const file = await this.loadFileInfo(fileId);

    return [file, await this.storages.get(file.storage).loadFile(file)];
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.loadFileInfo(fileId);
    await this._fileRepository.delete(fileId);

    return this.storages.get(file.storage).deleteFile(file);
  }
}
