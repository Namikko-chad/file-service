/* eslint-disable security/detect-non-literal-fs-filename */
import * as p from 'path';
import * as fs from 'fs/promises';
import { config, } from '../config/config';
import { AbstractStorage, } from './abstract';
import { File, } from '../db';
import { StorageType, } from './enum';

export class FolderStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 1024 * 4,
	};
	type = StorageType.FOLDER;

	init(): void {
		return;
	}

	async saveFile(file: File, data: Buffer): Promise<void> {
		const dirPath = p.join(config.files.filesDir);
		await fs.mkdir(dirPath, { recursive: true, });
		const fileName = `${file.id}.${file.ext}`;
		const filePath = p.join(dirPath, fileName);
		return fs.writeFile(filePath, data);
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
