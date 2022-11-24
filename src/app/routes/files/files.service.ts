import { Inject, Injectable, } from '@nestjs/common';

import File from '../../database/entity/file.entity';

import { FileRepository, } from '../../database/repositories/';
import { FileEditDto } from './file-edit.dto';
import { ListDto } from 'app/dto/list.dto';

@Injectable()
export default class FilesService {
	@Inject(FileRepository)
	private readonly _repository: FileRepository;

	async list(data: ListDto): Promise<[File[], number]> {
		return this._repository.findAndCount({
			order: data.order
		});
	}

	async create(data: Express.Multer.File): Promise<File> {
		const file = this._repository.create();
		file.data = data.buffer;
		await this._repository.save(file);
		return file;
	}

	async edit(fileId: string, data: FileEditDto): Promise<File> {
		const file = await this._repository.findOneBy({
			id: fileId,
		});
		await this._repository.update(file, {
			ext: data.name,
		});
		return file;
	}

	async retrieve(fileId: string): Promise<File> {
		const file = await this._repository.findOneBy({
			id: fileId,
		});
		return file;
	}

	async retrieveInfo(fileId: string): Promise<File> {
		const file = await this._repository.findOneBy({
			id: fileId,
		});
		return file;
	}
}
