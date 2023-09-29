/* eslint-disable @typescript-eslint/ban-ts-comment */
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { Sequelize, } from 'sequelize-typescript';

import { Errors, ErrorsMessages, } from '../enum';
import { File,filesConfig,  } from '../files';
import { Exception, } from '../utils';
import { FileFormData, } from './storages.interface';
import { DBStorage, } from './storages/database/storage.database.service';
import { FolderStorage, } from './storages/folder/storage.folder.service';
import { GoogleDriveStorage, } from './storages/google-drive/storage.google-drive.service';
import { MegaIOStorage, } from './storages/mega-io/storage.mega-io.service';
import { AbstractStorage, } from './storages/storage.abstract.service';
import { IFilename, } from './storages/storage.interface';

export class Storage {
  storages: Map<string, AbstractStorage> = new Map();

  constructor() {
    const storages: AbstractStorage[] = [
      new DBStorage(), new FolderStorage(), new GoogleDriveStorage(), new MegaIOStorage()
    ];
    storages.sort ( (a,b) => a.config.fileSizeLimit - b.config.fileSizeLimit ).forEach( storage => 
      this.storages.set(storage.constructor.name.slice(0, -7).toLowerCase(), storage)
    );
  }

  async init(db: Sequelize): Promise<void> {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Array.from(this.storages).map(async ([_type, storage]) => {
        await storage.init(db);
      })
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

    if (!ext || !mime) throw new Exception(Errors.InvalidPayload, 'Unsupported file type');

    if (!filesConfig.files.allowedExtensionsRegExp.exec(ext)) {
      throw new Exception(Errors.UnsupportedMediaType, 'This media file extension forbidden');
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

    throw new Exception(Errors.PayloadTooLarge, ErrorsMessages[Errors.PayloadTooLarge]);
  }

  private getStorageType(storage: AbstractStorage): string {
    return storage.constructor.name.slice(0, -7).toLowerCase();
  }

  private async loadFileInfo(fileId: string): Promise<File> {
    const file = await File.findByPk(fileId);
    if (!file) throw new Exception(Errors.NotFound, 'File not found', { fileId, });

    return file;
  }

  async sizeFile(fileIds?: string[]): Promise<number> {
    const size = await File.sum('size', {
      where: {
        id: fileIds,
      },
    });

    return size;
  }

  async saveFile(uploadedFile: FileFormData): Promise<File> {
    const hash = this.getHash(uploadedFile.payload);
    const { mime, ext, } = await this.getExt(uploadedFile.filename, uploadedFile.payload);
    const size = uploadedFile.payload.length;
    const storage = this.getStorage(size);
    const [file, created] = await File.findOrCreate({
      where: {
        hash,
      },
      defaults: {
        ext,
        mime,
        size: uploadedFile.payload.length,
        storage: this.getStorageType(storage),
        hash,
      },
    });
    if (created) await storage.saveFile(file, uploadedFile.payload);

    return file;
  }

  async loadFile(fileId: string): Promise<[File, Buffer]> {
    const file = await this.loadFileInfo(fileId);

    // @ts-ignore
    return [file, await this.storages.get(file.storage).loadFile(file)];
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.loadFileInfo(fileId);

    // @ts-ignore
    return this.storages.get(file.storage).deleteFile(file);
  }
}
