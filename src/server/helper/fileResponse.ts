import { IFileResponse, } from '../interfaces/file';
import { File, FileUser, } from '../db';

export function fileResponse(
	fileUser: FileUser,
	file: File
): IFileResponse {
	return {
		id: fileUser.id,
		name: fileUser.name,
		ext: file.ext,
		mime: file.mime,
		size: file.size,
		public: fileUser.public,
		userId: fileUser.userId,
		hash: file.hash,
	};
}
