/* eslint-disable @typescript-eslint/ban-ts-comment */
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { Request, } from '@hapi/hapi';
import { File, } from '../db';
import { config, } from '../config/config';
import { splitFilename, Exception, getUUID, } from '../utils';
=======
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { Sequelize, } from 'sequelize-typescript';

import { config, } from '../config/config';
import { File, } from '../db';
>>>>>>> 35e75f8c834ab18aa28b9f1cbdea578849276554
import { Errors, ErrorsMessages, } from '../enum';
import { IFilename, } from '../interfaces';
import { Exception, } from '../utils';
import { AbstractStorage, } from './abstract';
import { StorageType, } from './enum';
import { FilePayload, StorageOptions, } from './interface';
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

		async streamer(r: Request): Promise<FilePayload[]> {
			const contentType = r.headers['content-type'];
			if (!contentType)
				throw new Exception(Errors.InvalidHeader, ErrorsMessages[Errors.InvalidHeader]);
			const boundary = contentType.slice(contentType.indexOf('boundary=')+9)
	
			let chunkCount = 0;
			let bufferCount = 1;
	
			const rawPayload = new Promise<FilePayload[]>((resolve, reject) => {
				let buffer = Buffer.from('');
				const res: FilePayload[] = [];
	
				r.raw.req.on('data', (chunk: Buffer) => {
					chunkCount++;
					buffer = Buffer.concat([buffer, chunk]);
					if (buffer.byteLength >= config.files.bufferSize) {
						this.analyzer(res, buffer, boundary);
						this.recorder(res, buffer);
						buffer = Buffer.from('');
						bufferCount++;
					}
				});
	
				r.raw.req.on('error', (data) => {
					reject(data);
				});
	
				r.raw.req.on('end', () => {
					this.analyzer(res, buffer, boundary);
					this.recorder(res, buffer);
					resolve(res);
				});
			});
	
			let res = await rawPayload
	
			if (config.debug) {
				console.debug('Chunk count: %s', chunkCount)
				console.debug('Used buffers: %s', bufferCount)
			}
	
			res = await Promise.all( res.map( async (file) => {
				const { mime, ext, } = await this.getExt(file.name, file.payload ?? file.path);
				file.ext = ext;
				file.mime = mime;
				// @ts-ignore
				file.hash = this.getHash(file.payload ?? file.path);
				return file;
			}));
	
			return res;
		}
	
		private analyzer(res: FilePayload[], buffer: Buffer, boundary: string): void {
			const startLines: number[] = [];
			let offset = 0;
			let searchRes: number;
			do {
				searchRes = buffer.indexOf(`--${boundary}\r\n`, offset);
				if (searchRes >= 0) {
					startLines.push(searchRes);
					offset += ++searchRes;
				}
			} while (searchRes !== -1)
			const endLine = buffer.indexOf(`--${boundary}--\r\n`);
			const dispositions = buffer.toString().match(/^Content-Disposition.*$/gm);
			const types = buffer.toString().match(/^Content-Type.*$/gm);
			if (!types || !dispositions || !startLines.length || (startLines.length !== types.length && startLines.length !== dispositions.length))
				return;
			startLines.forEach( (value, key) => {
				const start = buffer.slice(value).toString().split('\r\n').slice(0,4).join('\r\n').length+2;
				const end = (startLines[key+1] ?? endLine ?? 0)-2;
				const part = buffer.slice(value, end);
				const disposition = dispositions[Number(key)];
				if (!disposition)
					throw new Exception(Errors.InvalidHeader, ErrorsMessages[Errors.InvalidHeader]);
				const type = types[Number(key)]
				if (!type)
					throw new Exception(Errors.InvalidHeader, ErrorsMessages[Errors.InvalidHeader]);
				res.push({
					name: disposition
						.slice(
							disposition.indexOf('filename=')+10, 
							disposition.indexOf('"', disposition.indexOf('filename=')+11)
						),
					headers: {
						'Content-Disposition': disposition.slice(21),
						'Content-Type': type.slice(14),
					},
					start: start + value,
					length: part.length - start,
					multipart: !endLine || !startLines[key+1],
				})
			});
		}
	
		private recorder(res: FilePayload[], buffer: Buffer): void {
			res
				// .filter( res => !(res.path || res.payload) )
				// .filter( res => res.start && res.length )
				.forEach( value => {
					const bufForSave = buffer.slice(value.start, value.start+value.length)
					if (value.length > config.files.bufferSize) {
						if (!value?.storage) {
							// eslint-disable-next-line security/detect-non-literal-fs-filename
							value.storage = fs.createWriteStream(path.resolve(config.files.bufferStorage, getUUID()));
						}
						if (value.payload) {
							value.storage.write(value.payload);
							delete value.payload;
						}
						value.storage.write(bufForSave);
						if (!value.multipart && value.storage.writableLength === value.length) {
							value.path = value.storage.path;
							value.storage.end();
							delete value.storage;
						}
					} else {
						value.payload = bufForSave;
					}
				} )
		}
}
