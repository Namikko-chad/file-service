import { Errors, ErrorsMessages, StorageType, } from '../enum';
import { FileStorage, } from '../db/models';
import { Exception, } from '../utils/Exception';
import { AbstractStorage, } from './abstract';
import { FileFormData, Storage, } from './interface';


export class DBStorage extends AbstractStorage implements Storage {
	type = StorageType.DB;

	async saveFile(file: FileFormData): Promise<FileStorage> {
		const hash = this.getHash(file.payload);
		const { mime, ext, } = await this.getExt(file.filename, file.payload);
		const [fileStorage] = await FileStorage.findOrCreate({
			where: {
				hash,
			},
			defaults: {
				ext,
				mime,
				storage: this.type,
				hash,
				data: file.payload,
			},
		});
		return fileStorage;
	}

	async loadFile(fileId: string): Promise<FileStorage> {
		const fileStorage = await FileStorage.scope('withData').findByPk(fileId);
		if (!fileStorage)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		return fileStorage;
	}

	async deleteFile(fileId: string): Promise<boolean> {
		const fileStorage = await FileStorage.findByPk(fileId);
		if (!fileStorage)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		await fileStorage.destroy();
		return true;
	}
}