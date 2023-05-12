/* eslint-disable @typescript-eslint/ban-ts-comment */
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { Sequelize, } from 'sequelize-typescript';

import { config, } from '../config/config';
import { File, } from '../db';
import { Errors, ErrorsMessages, } from '../enum';
import { IFilename, } from '../interfaces';
import { Exception, } from '../utils';
import { AbstractStorage, } from './abstract';
import { StorageType, } from './enum';
import { FileFormData, StorageOptions, } from './interface';
import { DBStorage, } from './storage.DB';
import { FolderStorage, } from './storage.Folder';

export class Storage {
  defaultStorage: StorageType;
  storages: Map<StorageType, AbstractStorage> = new Map();

  constructor(options?: StorageOptions) {
    this.defaultStorage = options?.type ?? StorageType.DB;
    this.storages.set(StorageType.DB, new DBStorage());
    this.storages.set(StorageType.FOLDER, new FolderStorage());
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

    if (!config.files.allowedExtensionsRegExp.exec(ext)) {
      throw new Exception(Errors.Forbidden, 'This media file extension forbidden');
    }

    return { ext, mime, };
  }

  getHash(data: Buffer): string {
    const hash_md5 = crypto.createHash('md5');
    hash_md5.update(data);

    return hash_md5.digest('hex');
  }

  private selectStorage(size: number): AbstractStorage {
    for (const [_, storage] of this.storages) {
      if (storage.params.fileSizeLimit > size) {
        return storage;
      }
    }

    throw new Exception(Errors.PayloadTYooLarge, ErrorsMessages[Errors.PayloadTYooLarge]);
  }

  private async loadFileInfo(fileId: string): Promise<File> {
    const file = await File.findByPk(fileId);
    if (!file) throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], { fileId, });

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
    const storage = this.selectStorage(size);
    const [file, created] = await File.findOrCreate({
      where: {
        hash,
      },
      defaults: {
        ext,
        mime,
        size: uploadedFile.payload.length,
        storage: this.defaultStorage,
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
