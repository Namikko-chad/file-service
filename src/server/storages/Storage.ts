/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import { Request, } from '@hapi/hapi';
import { File, } from '../db';
import { config, } from '../config/config';
import { Exception, getUUID, } from '../utils';
import { Errors, ErrorsMessages, } from '../enum';
import { StorageType, } from './enum';
import { FileFormData, StorageOptions, } from './interface';
import { DBStorage, } from './storage.DB';
import { FolderStorage, } from './storage.Folder';
import { AbstractStorage, } from './abstract';

interface FilePayload {
  filename: string;
  headers: object;
	start: number;
	length: number;
	multipart: boolean;
	payload?: Buffer;
	path?: fs.PathLike;
	storage?: fs.WriteStream;
}

export class Storage {
	defaultStorage: StorageType;
	storages: Map<StorageType, AbstractStorage> = new Map();

	constructor(options?: StorageOptions) {
		this.defaultStorage = options?.type ?? StorageType.DB;
		this.storages.set(StorageType.DB, new DBStorage());
		this.storages.set(StorageType.FOLDER, new FolderStorage());
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

	async saveFile(file: FileFormData): Promise<File> {
		// @ts-ignore
		return this.storages.get(this.defaultStorage).saveFile(file);
	}

	async loadFile(fileId: string): Promise<File> {
		const file = await this.loadFileInfo(fileId);
		// @ts-ignore
		file.data = await this.storages.get(file.storage).loadFile(file);
		return file;
	}

	async deleteFile(fileId: string): Promise<void> {
		const file = await this.loadFileInfo(fileId);
		// @ts-ignore
		return this.storages.get(file.storage).deleteFile(file);
	}

	async streamer(r: Request): Promise<FilePayload[]> {
		const boundary = r.headers['content-type'].slice(r.headers['content-type'].indexOf('boundary=')+9)

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

		const res = await rawPayload

		if (config.debug) {
			console.debug('Chunk count: %s', chunkCount)
			console.debug('Used buffers: %s', bufferCount)
		}

		console.log(res);
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
			res.push({
				filename: dispositions[Number(key)]
					.slice(
						dispositions[Number(key)].indexOf('filename=')+10, 
						dispositions[Number(key)].indexOf('"', dispositions[Number(key)].indexOf('filename=')+11)
					),
				headers: {
					'Content-Disposition': dispositions[Number(key)].slice(21),
					'Content-Type': types[Number(key)].slice(14),
				},
				start: start + value,
				length: part.length - start,
				multipart: !endLine || !startLines[key+1],
			})
			console.log(!endLine, !startLines[key+1])
		});
	}

	private recorder(res: FilePayload[], buffer: Buffer): void {
		console.log(config.files.bufferSize)
		res
			// .filter( res => !(res.path || res.payload) )
			// .filter( res => res.start && res.length )
			.forEach( (value, index) => {
				const bufForSave = buffer.slice(value.start, value.start+value.length)
				if (value.length > config.files.bufferSize) {
					if (!res[index]?.storage) {
						// eslint-disable-next-line security/detect-non-literal-fs-filename
						res[index].storage = fs.createWriteStream(path.resolve(config.files.bufferStorage, getUUID()));
					}
					const storage = res[index].storage as fs.WriteStream;
					if (value.payload) {
						storage.write(value.payload);
						delete value.payload;
					}
					storage.write(bufForSave);
					if (!value.multipart && storage.writableLength === value.length) {
						res[index].path = storage.path;
						storage.end();
						delete res[index]?.storage;
					}
				} else {
					res[index].payload = bufForSave;
				}
			} )
	}
}
