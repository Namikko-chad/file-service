import { Injectable, } from '@nestjs/common';
import { FindOptionsWhere, } from 'typeorm';
import { ListDto, } from 'app/dto';
import { Errors, ErrorsMessages, } from 'app/enum/errors';
import { Exception, } from 'app/utils/Exception';
import { Utils, } from 'app/utils/utils';
import { FileUser, } from './entity/file-user.entity';
import { FileUserRepository, } from './repositories/file-user.repository';
import { FileEditDto, FileInfoDto, } from './dto';
import { FileRepository, } from './repositories/file.repository';
import { StorageRepository, } from './repositories/storage.repository';

@Injectable()
export class FileService {
	constructor(
		private readonly _fileRepository: FileRepository,
		private readonly _fileUserRepository: FileUserRepository,
		private readonly _storageRepository: StorageRepository
	) {}

	async list(userId: string, listParam: ListDto<FileUser>): Promise<[FileUser[], number]> {
		const condition = Utils.listParam<FileUser>(listParam, ['name']);
		(condition.where as FindOptionsWhere<FileUser>[])[0] = { ... (condition.where as FindOptionsWhere<FileUser>[])[0], userId, };
		return this._fileUserRepository.findAndCount({
			...condition,
			relations: ['file'],
		});
	}

	async create(userId: string, payload: Express.Multer.File): Promise<FileUser> {
		const file = this._fileRepository.create({
			size: payload.size,
			storage: 'db',
			hash: '',
			mime: payload.mimetype,
			ext: '',
		});
		await this._fileRepository.save(file);
		const storage = this._storageRepository.create({
			id: file.id,
			data: payload.buffer,
		})
		await this._storageRepository.save(storage);
		const fileUser = this._fileUserRepository.create({
			userId,
			fileId: file.id,
			name: payload.originalname,
		})
		await this._fileUserRepository.save(fileUser);
		fileUser.file = file;
		return fileUser;
	}

	async update(fileId: string, payload: FileEditDto): Promise<FileUser> {
		const fileUser = await this.retrieveInfo(fileId);
		await this._fileUserRepository.update(fileId, {
			public: payload.public ?? fileUser.public,
			name: payload.name ?? fileUser.name,
		})
		await this._fileUserRepository.reload(fileUser)
		return fileUser;
	}

	async delete(fileId: string): Promise<void> {
		await this._fileUserRepository.delete(fileId);
	}

	async retrieve(fileId: string): Promise<[FileUser, Buffer]> {
		const fileUser = await this._fileUserRepository.findOne({
			where: {
				id: fileId,
			},
			relations: ['file'],
		});
		if (!fileUser)
			throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], {
				fileId,
			});
		const storage = await this._storageRepository.findOne({
			where: {
				id: fileUser.file.id,
			},
		})
		return [fileUser, storage.data];
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
