import { Inject, Injectable, } from '@nestjs/common';

import FileRepository from '../../database/repositories/file.repository';
import File from '../../database/entity/file.entity';

import { FileEditDto, FileListDto, } from './files.dto';

@Injectable()
export default class FilesService {
  @Inject(FileRepository)
	private readonly _repository: FileRepository;

  async list(_data: FileListDto): Promise<[File[], number]> {
  	return this._repository.findAndCount();
  }

  async create(buffer: Buffer): Promise<File> {
  	const file = this._repository.create();
  	file.data = buffer;
  	await this._repository.save(file);
  	return file;
  }

  async edit(fileId: string, _data: FileEditDto): Promise<File> {
  	const file = await this._repository.findOneBy({
  		id: fileId,
  	});
  	await this._repository.update(file, {
  		ext: '4',
  	});
  	return file;
  }

  async retrieve(fileId: string): Promise<File> {
  	const file = await this._repository.findOneBy({
  		id: fileId,
  	});
  	return file;
  }
}
