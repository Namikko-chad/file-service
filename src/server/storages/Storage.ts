/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { Request, } from '@hapi/hapi';
import { File, } from '../db';
import { config, } from '../config/config';
import { splitFilename, Exception, getUUID, } from '../utils';
import { Errors, ErrorsMessages, } from '../enum';
import { StorageType, } from './enum';
import { FilePayload, StorageOptions, } from './interface';
import { DBStorage, } from './storage.DB';
import { FolderStorage, } from './storage.Folder';
import { AbstractStorage, } from './abstract';


export class Storage {
	storages: Map<StorageType | string, AbstractStorage> = new Map();
	storageSizes: Map<StorageType | string, number> = new Map();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(_options?: StorageOptions) {
		this.storages.set(StorageType.DB, new DBStorage());
		this.storages.set(StorageType.FOLDER, new FolderStorage());
	}

	public init(): this {
		this.storages.forEach( storage => this.storageSizes.set(storage.type, storage.params.fileSizeLimit) );
		this.storageSizes = new Map([...this.storageSizes.entries()].sort((a, b) => a[1] - b[1]));
		return this;
	}

	// FIXME use stream for md5
	private getHash(file: Buffer | fs.PathLike): string {
		let data: Buffer;
		if (Buffer.isBuffer(file)) {
			data = file
		} else if (typeof file === 'string') {
			data = Buffer.from(file)
		}
		const hash_md5 = crypto.createHash('md5');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		hash_md5.update(data);
		return hash_md5.digest('hex');
	}

	private async getExt(name: string, file?: Buffer | fs.PathLike): Promise<{ ext: string; mime: string }> {
		let ext = '';
		let mime = '';
		if (Buffer.isBuffer(file)) {
			const fileExt = await fileType.fromBuffer(file);
			if (fileExt) {
				ext = fileExt.ext;
				mime = fileExt.mime;
			}
		} else if (typeof file === 'string') {
			const fileExt = await fileType.fromFile(file);
			if (fileExt) {
				ext = fileExt.ext;
				mime = fileExt.mime;
			}
		}
		// try search in filename
		if (!ext || !mime) {
			const splitName = splitFilename(name);
			ext = splitName.ext;
			mime = mimeType.lookup(name) as string;
		}

		if (!ext || !mime) throw new Exception(Errors.InvalidPayload, 'Unsupported file type');

		if (!config.files.allowedExtensionsRegExp.exec(ext)) {
			throw new Exception(Errors.Forbidden, 'This media file extension forbidden');
		}

		return { ext, mime, };
	}

	private async loadFileInfo(fileId: string): Promise<File> {
		const file = await File.findByPk(fileId);
		if (!file)
			throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], { fileId, });
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

	async saveFile(uploadedFile: FilePayload): Promise<File> {
		// const storage = this.storages.get(
		// 	[...this.storageSizes.entries()].every((value) => {
		// 		return uploadedFile.length < value[1],
		// 	})
		// );
		const [file] = await File.findOrCreate({
			where: {
				hash: uploadedFile.hash,
			},
			defaults: {
				ext: uploadedFile.ext,
				mime: uploadedFile.mime,
				storage: StorageType.DB,
				hash: uploadedFile.hash,
			},
		});
		// @ts-ignore
		await this.storages.get(StorageType.DB).saveFile(file, uploadedFile)
		return file;
	}

	async loadFile(fileId: string): Promise<File> {
		const file = await this.loadFileInfo(fileId);
		if (!this.storages.has(file.storage))
			throw new Exception(Errors.InternalServerError, 'Unknown storage');
		// @ts-ignore
		file.data = await this.storages.get(file.storage).loadFile(file);
		return file;
	}

	async deleteFile(fileId: string): Promise<void> {
		const file = await this.loadFileInfo(fileId);
		if (!this.storages.has(file.storage))
			throw new Exception(Errors.InternalServerError, 'Unknown storage');
		// @ts-ignore
		return this.storages.get(file.storage).deleteFile(file);
	}
}
