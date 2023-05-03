import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';

import { AbstractRepository, } from '../../database/AbstractRepository';
import { File, } from '../entity/file.entity';

@Injectable()
export class FileRepository extends AbstractRepository<File> {
  constructor(
  @InjectRepository(File)
    repository: AbstractRepository<File>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
