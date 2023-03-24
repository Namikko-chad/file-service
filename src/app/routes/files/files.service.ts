/* eslint-disable @typescript-eslint/require-await */
import { Inject, Injectable, } from '@nestjs/common';
import { FileUser, File, } from 'app/database';
import { ListDto, } from 'app/dto';

import { FileRepository, FileUserRepository, } from '../../database/repositories/';
import { FileEditDto, } from './dto';

@Injectable()
export default class FilesService {
	@Inject(FileRepository)
	private readonly _fileRepository: FileRepository;
	private readonly _fileUserRepository: FileUserRepository;

	async list(data: ListDto): Promise<[FileUser[], number]> {
		// return this._fileUserRepository.findAndCount({
		// 	order: data.order,
		// });
		console.log(data)
		return [[new FileUser()], 1]
	}

	async create(data: Express.Multer.File): Promise<FileUser> {
		const file = this._fileRepository.create();
		file.data = data.buffer;
		await this._fileRepository.save(file);
		return file;
	}

	async edit(fileId: string, data: FileEditDto): Promise<File> {
		const file = await this._fileUserRepository.findOneBy({
			id: fileId,
		});
		await this._fileUserRepository.update(file, {
			name: data.name,
		});
		return file;
	}

	async retrieve(fileId: string): Promise<File> {
		const file = await this._fileUserRepository.findOneBy({
			id: fileId,
		});
		return file;
	}

	async retrieveInfo(fileId: string): Promise<File> {
		const file = await this._fileUserRepository.findOneBy({
			id: fileId,
		});
		return file;
	}
}
