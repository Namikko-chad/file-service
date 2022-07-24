import * as p from 'path';
import * as fs from 'fs/promises';
import { config, } from '../config/config';
import { AbstractStorage, } from './abstract';
import { FileFormData, } from './interface';
import { File, } from '../db';
import { StorageType, } from './enum';

export class FolderStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 1024 * 4,
	}
	type = StorageType.FOLDER;

	async saveFile(uploadedFile: FileFormData): Promise<File> {
		/* eslint-disable security/detect-non-literal-fs-filename */
		const { mime, ext, } = await this.getExt(uploadedFile.filename, uploadedFile.payload);
		const hash = this.getHash(uploadedFile.payload);
		const [file] = await File.findOrCreate({
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
		const fileName = `${file.id}.${ext}`;
		const filePath = p.join(dirPath, fileName);
		await fs.writeFile(filePath, uploadedFile.payload);
		return file;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async loadFile(file: File): Promise<Buffer> {
		const filePath = p.join(config.files.filesDir, `${file.id}.${file.ext}`);
		return Buffer.from(filePath);
	}

	async deleteFile(file: File): Promise<void> {
		const filePath = p.join(config.files.filesDir, `${file.id}.${file.ext}`);
		return fs.unlink(filePath);
	}
}
