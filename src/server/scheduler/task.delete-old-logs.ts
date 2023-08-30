import { Op,Transaction, } from 'sequelize';

import { AbstractTask, } from './AbstractTask';
import { SchedulerStatus, } from './scheduler.enum';
import { SchedulerTask, } from './scheduler.model';

export class DeleteOldLogsTask extends AbstractTask {
  interval = '0 0 * * *';

  handler = async (transaction?: Transaction): Promise<void> => {
    await SchedulerTask.destroy({
      where: {
        status: SchedulerStatus.Completed,
        finishedAt: {
          [Op.lt]: Date.now() - 2592000000,
        },
      },
      transaction,
    });
  };
}
