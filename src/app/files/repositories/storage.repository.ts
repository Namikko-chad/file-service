import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Storage, } from '../entity/storage.entity';
import { AbstractRepository, } from 'app/database/AbstractRepository';

@Injectable()
export class StorageRepository extends AbstractRepository<Storage> {
	constructor(
		@InjectRepository(Storage)
			repository: AbstractRepository<Storage>
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
