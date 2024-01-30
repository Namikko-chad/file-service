import { Inject, Logger, } from '@nestjs/common';
import { SchedulerStatus, SchedulerTask, } from '@prisma/client';

import { DatabaseService, } from '../database';
import { Exception, } from '../utils';

export abstract class AbstractTask {
  private readonly _logger = new Logger('Scheduler');
  @Inject(DatabaseService)
  protected readonly _ds: DatabaseService;
  abstract taskName: string;

  async handler(): Promise<void> {
    const task = await this._start();

    try {
      await this.task();
      void this._complete(task);
    } catch (error) {
      void this._error(task, <Error>error);
    }
  }

  abstract task(): Promise<void>;

  protected _start(): Promise<SchedulerTask> {
    this._logger.log(`${this.taskName} running at ${new Date().toString()}`);

    return this._ds.schedulerTask.create({
      data: {
        status: SchedulerStatus.Started,
        name: this.taskName,
      },
    });
  }  
  
  protected async _complete(task: SchedulerTask): Promise<SchedulerTask> {
    this._logger.log(`${this.taskName} completed at ${new Date().toString()}`);

    return await this._ds.schedulerTask.update({
      where: {
        id: task.id,
      },
      data: {
        status: SchedulerStatus.Completed,
        finishedAt: new Date(),
      },
    });
  }

  protected async _error(task: SchedulerTask, error: Error | Exception): Promise<SchedulerTask> {
    this._logger.error(`${this.taskName} failed at ${new Date().toString()}`, error);
    
    return await this._ds.schedulerTask.update({
      where: {
        id: task.id,
      },
      data: {
        status: SchedulerStatus.Completed,
        finishedAt: new Date(),
        error: error.toString(),
      },
    });
  }
  
}
