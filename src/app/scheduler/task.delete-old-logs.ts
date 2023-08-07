import { Cron, } from '@nestjs/schedule';
import { LessThan, QueryRunner, } from 'typeorm';

import { AbstractTask, } from './abstract-task';
import { SchedulerStatus, } from './scheduler.enum';

export class DeleteOldLogsTask extends AbstractTask {
  override taskName = DeleteOldLogsTask.name;

  @Cron('0 0 * * *', {
    name: DeleteOldLogsTask.name,
  })
  override async handler(queryRunner?: QueryRunner): Promise<void> {
    await super.handler(queryRunner);
  };

  async task(queryRunner?: QueryRunner): Promise<void> {
    await this._repository.delete({
      status: SchedulerStatus.Completed,
      finishedAt: LessThan(new Date(Date.now() - 2592000000)),
    },
    {
      queryRunner,
    });
  }
}
