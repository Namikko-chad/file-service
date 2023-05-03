import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';

import { AbstractRepository, } from '../../../database/AbstractRepository';
import { Storage, } from './storage.entity';

@Injectable()
export class StorageRepository extends AbstractRepository<Storage> {
  constructor(
  @InjectRepository(Storage)
    repository: AbstractRepository<Storage>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
