import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';

import { AbstractRepository, } from '../../../database/AbstractRepository';
import { GoogleDrive, } from './storage.google-drive.entity';

@Injectable()
export class GoogleDriveRepository extends AbstractRepository<GoogleDrive> {
  constructor(
  @InjectRepository(GoogleDrive)
    repository: AbstractRepository<GoogleDrive>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
