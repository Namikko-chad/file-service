/* eslint-disable @typescript-eslint/ban-ts-comment */
import { File, } from '../db';
import { Exception, } from '../utils';
import { Errors, ErrorsMessages, } from '../enum';
import { StorageType, } from './enum';
import { FileFormData, Storage as IStorage, StorageOptions, } from './interface';
import { DBStorage, } from './storage.DB';
import { FolderStorage, } from './storage.Folder';

export class Storage {
	defaultStorage: StorageType;
	storages: Map<StorageType, IStorage> = new Map();

	constructor(options?: StorageOptions) {
		this.defaultStorage = options?.type ?? StorageType.DB;
		this.storages.set(StorageType.DB, new DBStorage());
		this.storages.set(StorageType.FOLDER, new FolderStorage());
	}

	private async loadFileInfo(fileId: string): Promise<File> {
		const file = await File.findByPk(fileId);
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		return file;
	}

	async saveFile(file: FileFormData): Promise<File> {
		// @ts-ignore
		return this.storages.get(this.defaultStorage).saveFile(file)
	}

	async loadFile(fileId: string): Promise<File> {
		const file = await this.loadFileInfo(fileId);
		// @ts-ignore
		file.data = await this.storages.get(file.storage).loadFile(file);
		return file
	}

	async deleteFile(fileId: string): Promise<void> {
		const file = await this.loadFileInfo(fileId);
		// @ts-ignore
		return this.storages.get(file.storage).deleteFile(file)
	}
}
