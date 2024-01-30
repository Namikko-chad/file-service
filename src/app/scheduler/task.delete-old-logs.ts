import { Cron, } from '@nestjs/schedule';
import { SchedulerStatus, } from '@prisma/client';

import { AbstractTask, } from './abstract-task';

export class DeleteOldLogsTask extends AbstractTask {
  override taskName = DeleteOldLogsTask.name;

  @Cron('*/1 * * * *', {
    name: DeleteOldLogsTask.name,
  })
  override async handler(): Promise<void> {
    await super.handler();
  };

  async task(): Promise<void> {
    await this._ds.schedulerTask.deleteMany({
      where: {
        status: SchedulerStatus.Completed,
        finishedAt: {
          lt: new Date(Date.now() - 2592000000),
        },
      },
    });
  }
}
