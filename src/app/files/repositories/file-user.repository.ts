import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';

import { AbstractRepository, } from '../../database/AbstractRepository';
import { FileUser, } from '../entity/file-user.entity';

@Injectable()
export class FileUserRepository extends AbstractRepository<FileUser> {
  constructor(
  @InjectRepository(FileUser)
    repository: AbstractRepository<FileUser>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
