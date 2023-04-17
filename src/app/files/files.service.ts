import { Injectable, } from '@nestjs/common';
import { ListDto, } from 'app/dto';
import { Errors, ErrorsMessages, } from 'app/enum/errors';
import { Exception, } from 'app/utils/Exception';
import { Utils, } from 'app/utils/utils';
import { FileUser, } from './entity/file-user.entity';
import { FileUserRepository, } from './repositories/file-user.repository';
import { FileInfoDto, } from './dto';
import { FileRepository, } from './repositories/file.repository';

@Injectable()
export class FileService {
	constructor(
		private readonly _fileRepository: FileRepository,
		private readonly _fileUserRepository: FileUserRepository
	) {}

	async list(listParam: ListDto<FileUser>): Promise<[FileUser[], number]> {
		return this._fileUserRepository.findAndCount({
			...Utils.listParam<FileUser>(listParam, ['name']),
			relations: ['file'],
		});
	}

	async retrieve(fileId: string): Promise<FileUser> {
		const fileUser = await this._fileUserRepository.findOne({
			where: {
				id: fileId,
			},
		});
		if (!fileUser)
			throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], {
				fileId,
			});
		const file = await this._fileRepository.findOne({
			where: {
				id: fileUser.fileId,
			},
			select: ['data', 'ext', 'mime'],
		});
		fileUser.file = file;
		return fileUser;
	}

	async retrieveInfo(fileId: string): Promise<FileUser> {
		const file = await this._fileUserRepository.findOne({
			where: {
				id: fileId,
			},
			relations: ['file'],
		});
		if (!file)
			throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], {
				fileId,
			});
		return file;
	}

	fileResponse(fileUser: FileUser): FileInfoDto {
		return {
			id: fileUser.id,
			name: fileUser.name,
			ext: fileUser.file.ext,
			mime: fileUser.file.mime,
			size: fileUser.file.size,
			public: fileUser.public,
			userId: fileUser.userId,
			hash: fileUser.file.hash,
		};
	}
}
