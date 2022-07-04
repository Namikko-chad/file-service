import { IFileResponse, } from '../interfaces/file';
import { File, } from '../models/File';
import { FileStorage, } from '../models/FileStorage';

export function fileResponse(
	file: File,
	fileStorage: FileStorage
): IFileResponse {
	return {
		id: file.id,
		name: file.name,
		ext: fileStorage.ext,
		mime: fileStorage.mime,
		public: file.public,
		userId: file.userId,
		hash: fileStorage.hash,
	};
}
