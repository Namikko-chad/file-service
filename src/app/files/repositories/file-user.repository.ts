import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { FileUser, } from '../entity/file-user.entity';

@Injectable()
export class FileUserRepository extends Repository<FileUser> {
	constructor(
		@InjectRepository(FileUser)
			repository: Repository<FileUser>
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
