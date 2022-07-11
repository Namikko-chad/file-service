import * as p from 'path';
import * as fs from 'fs/promises';
import { config, } from '../config/config';
import { Errors, ErrorsMessages, StorageType, } from '../enum';
import { FileStorage, } from '../db/models';
import { Exception, } from '../utils/Exception';
import { AbstractStorage, } from './abstract';
import { FileFormData, Storage, } from './interface';

export class FolderStorage extends AbstractStorage implements Storage {
	type = StorageType.FOLDER;

	async saveFile(file: FileFormData): Promise<FileStorage> {
		/* eslint-disable security/detect-non-literal-fs-filename */
		const { mime, ext, } = await this.getExt(file.filename, file.payload);
		const hash = this.getHash(file.payload);
		const [fileStorage] = await FileStorage.findOrCreate({
			where: {
				hash,
			},
			defaults: {
				ext,
				mime,
				storage: this.type,
				hash,
			},
		});

		const dirPath = p.join(config.files.filesDir);
		await fs.mkdir(dirPath, { recursive: true, });
		const fileName = `${fileStorage.id}.${ext}`;
		const filePath = p.join(dirPath, fileName);
		await fs.writeFile(filePath, file.payload);
		return fileStorage;
	}

	async loadFile(fileId: string): Promise<FileStorage> {
		const file = await FileStorage.findByPk(fileId);
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		const filePath = p.join(config.files.filesDir, `${file.id}.${file.ext}`);
		file.data = Buffer.from(filePath);
		return file;
	}

	async deleteFile(fileId: string): Promise<boolean> {
		const file = await FileStorage.findByPk(fileId);
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		const filePath = p.join(config.files.filesDir, `${file.id}.${file.ext}`);
		await fs.unlink(filePath);
		return true;
	}
}
