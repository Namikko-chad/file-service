import { HttpStatus, Inject, Injectable, } from '@nestjs/common';
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { In, } from 'typeorm';

import { Errors, ErrorsMessages, } from '../enum';
import { File, } from '../files/entity';
import { FileRepository, } from '../files/repositories';
import { Exception, } from '../utils/Exception';
import { StorageConfig, } from './storage.config';
import { StorageType, } from './storage.enum';
import { FileFormData, IFilename, } from './storage.interface';
import { DBStorage, } from './storages/database/storage.database';
import { AbstractStorage, } from './storages/storage.abstract';
import { FolderStorage, } from './storages/storage.Folder';

@Injectable()
export class StorageService {
  storages: Map<StorageType, AbstractStorage> = new Map();

  constructor(
    @Inject(StorageConfig) private readonly config: StorageConfig,
    @Inject(DBStorage) dbStorage: DBStorage,
    @Inject(FolderStorage) folderStorage: FolderStorage,
    @Inject(FileRepository) private readonly _fileRepository: FileRepository
  ) {
    this.storages.set(StorageType.DB, dbStorage);
    this.storages.set(StorageType.FOLDER, folderStorage);
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
    const hash = this.getHash(uploadedFile.payload);
    const { mime, ext, } = await this.getExt(uploadedFile.filename, uploadedFile.payload);
    const file = this._fileRepository.findOrCreate(
      {
        hash,
      },
      {
        ext,
        mime,
        size: uploadedFile.payload.length,
        storage: StorageType.DB,
        hash,
      }
    );

    return file;
  }

  async loadFile(fileId: string): Promise<[File, Buffer]> {
    const file = await this.loadFileInfo(fileId);

    return [file, await this.storages.get(file.storage as StorageType).loadFile(file)];
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.loadFileInfo(fileId);

    return this.storages.get(file.storage as StorageType).deleteFile(file);
  }
}
