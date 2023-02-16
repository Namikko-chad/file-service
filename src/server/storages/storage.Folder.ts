import path from 'path';
import * as fs from 'fs/promises';
import { PathLike, } from 'fs';
import { File, } from '../db';
import { AbstractStorage, } from './abstract';
import { FilePayload, } from './interface';
import { StorageType, } from './enum';

export class FolderStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 1024 * 4, // 4Gb
		folder: path.join(__dirname, '..', '..', '..', 'assets/'),
	}
	type = StorageType.FOLDER;

	private getPath(file: File): PathLike {
		return path.join(this.params.folder, `${file.id}.${file.ext}`);
	}

	async saveFile(file: File, data: Required<FilePayload>): Promise<void> {
		const dirPath = path.join(this.params.folder);
		const fileName = `${file.id}.${data.ext}`;
		const filePath = path.join(dirPath, fileName);
		await fs.mkdir(dirPath, { recursive: true, });
		switch (true) {
		case Buffer.isBuffer(data.payload): {
			await fs.writeFile(filePath, data.payload);
		}
			break;
		case typeof data.path === 'string': {
			await fs.copyFile(data.path, filePath);
			await fs.unlink(filePath);
		}
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async loadFile(file: File): Promise<Buffer> {
		return Buffer.from(this.getPath(file) as string);
	}

	async deleteFile(file: File): Promise<void> {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return fs.unlink(this.getPath(file));
	}
}
