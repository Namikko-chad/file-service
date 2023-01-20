import path from 'path';
import * as fs from 'fs/promises';
import { AbstractStorage, } from './abstract';
import { FileFormData, } from './interface';
import { File, } from '../db';
import { StorageType, } from './enum';

export class FolderStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 1024 * 4,
		folder: path.join(__dirname, '..', '..', '..', 'assets/'),
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

		const dirPath = path.join(this.params.folder);
		await fs.mkdir(dirPath, { recursive: true, });
		const fileName = `${file.id}.${ext}`;
		const filePath = path.join(dirPath, fileName);
		await fs.writeFile(filePath, uploadedFile.payload);
		return file;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async loadFile(file: File): Promise<Buffer> {
		const filePath = path.join(this.params.folder, `${file.id}.${file.ext}`);
		return Buffer.from(filePath);
	}

	async deleteFile(file: File): Promise<void> {
		const filePath = path.join(this.params.folder, `${file.id}.${file.ext}`);
		return fs.unlink(filePath);
	}
}
