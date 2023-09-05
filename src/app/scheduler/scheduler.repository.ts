import { Injectable, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';

import { AbstractRepository, } from '../database';
import { SchedulerTask, } from './scheduler.entity';

@Injectable()
export class SchedulerTaskRepository extends AbstractRepository<SchedulerTask> {
  constructor(
  @InjectRepository(SchedulerTask)
    repository: AbstractRepository<SchedulerTask>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
