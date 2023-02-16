import { File, } from '../db';
import { AbstractStorage, } from './abstract';
import { FilePayload, } from './interface';
import { StorageType, } from './enum';

export class DBStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 30, // 30Mb
	};
	type = StorageType.DB;

	async saveFile(file: File, data: Required<FilePayload>): Promise<void> {
		switch (true) {
		case Buffer.isBuffer(data.payload): {
			await file.update({
				data: data.payload,
			})
		}
			break;
		case typeof data.path === 'string': {
			const loadedData = Buffer.from(data.path as string);
			await file.update({
				data: loadedData,
			})
		}
		}
	}

	async loadFile(file: File): Promise<Buffer> {
		await file.reload({
			attributes: ['data'],
		})
		return file.data as Buffer;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async deleteFile(file: File): Promise<void> {
		await file.update({
			data: null,
		})
	}
}
