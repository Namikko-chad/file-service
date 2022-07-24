import { File, } from '../db';
import { AbstractStorage, } from './abstract';
import { FileFormData, } from './interface';
import { StorageType, } from './enum';

export class DBStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 30,
	}
	type = StorageType.DB;

	async saveFile(uploadedFile: FileFormData): Promise<File> {
		const hash = this.getHash(uploadedFile.payload);
		const { mime, ext, } = await this.getExt(uploadedFile.filename, uploadedFile.payload);
		const [file] = await File.findOrCreate({
			where: {
				hash,
			},
			defaults: {
				ext,
				mime,
				storage: this.type,
				hash,
				data: uploadedFile.payload,
			},
		});
		return file;
	}

	async loadFile(file: File): Promise<Buffer> {
		const fileData = await File.scope('withData').findByPk(file.id) as File;
		return fileData.data as Buffer;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async deleteFile(file: File): Promise<void> {
		file.data = undefined;
	}
}
