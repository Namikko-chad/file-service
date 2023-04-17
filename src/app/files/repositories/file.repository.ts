import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { File, } from '../entity/file.entity';

@Injectable()
export class FileRepository extends Repository<File> {
	constructor(
		@InjectRepository(File)
			repository: Repository<File>
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
