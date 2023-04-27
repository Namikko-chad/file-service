import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { FileUser, } from '../entity/file-user.entity';
import { AbstractRepository, } from 'app/database/AbstractRepository';

@Injectable()
export class FileUserRepository extends AbstractRepository<FileUser> {
	constructor(
		@InjectRepository(FileUser)
			repository: AbstractRepository<FileUser>
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
