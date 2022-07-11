import { IFileResponse, } from '../interfaces/file';
import { File, } from '../db/models/File';
import { FileStorage, } from '../db/models/FileStorage';

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
