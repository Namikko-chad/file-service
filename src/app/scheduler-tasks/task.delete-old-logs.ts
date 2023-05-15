import { Inject, } from '@nestjs/common';
import { Cron, } from '@nestjs/schedule';
import { LessThan, QueryRunner, } from 'typeorm';

import { AbstractTask, } from './abstract-task';
import { SchedulerStatus, } from './scheduler.enum';
import { SchedulerTaskRepository, } from './scheduler.repository';

export class DeleteOldLogsTask extends AbstractTask {
  @Inject(SchedulerTaskRepository)
  private readonly _repository: SchedulerTaskRepository;

  @Cron('*/5 * * * * *', {
    name: DeleteOldLogsTask.name,
  })
  async handler(queryRunner?: QueryRunner): Promise<void> {
    await this._repository.delete({
      status: SchedulerStatus.Completed,
      finishedAt: LessThan(new Date(Date.now() - 2592000000)),
    },
    {
      queryRunner,
    });
  };
}
