import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { File, } from '../entity/file.entity';
import { AbstractRepository, } from 'app/database/AbstractRepository';

@Injectable()
export class FileRepository extends AbstractRepository<File> {
	constructor(
		@InjectRepository(File)
			repository: AbstractRepository<File>
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
