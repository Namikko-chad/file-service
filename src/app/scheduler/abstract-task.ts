import { Inject, Logger, } from '@nestjs/common';
import { QueryRunner, } from 'typeorm';

import { Exception, } from '../utils';
import { SchedulerTask, } from './scheduler.entity';
import { SchedulerStatus, } from './scheduler.enum';
import { SchedulerTaskRepository, } from './scheduler.repository';

export abstract class AbstractTask {
  private readonly _logger = new Logger('Scheduler');
  @Inject(SchedulerTaskRepository)
  protected readonly _repository: SchedulerTaskRepository;
  abstract taskName: string;

  async handler(queryRunner?: QueryRunner): Promise<void> {
    const task = await this._start();

    try {
      await this.task(queryRunner);
      void this._complete(task);
    } catch (error) {
      void this._error(task, <Error>error);
    }
  }

  abstract task(queryRunner?: QueryRunner): Promise<void>;

  protected _start(): Promise<SchedulerTask> {
    this._logger.log(`${this.taskName} running at ${new Date().toString()}`);
    const task = this._repository.create({
      name: this.taskName,
    });

    return this._repository.save(task);
  }  
  
  protected _complete(task: SchedulerTask): Promise<SchedulerTask> {
    this._logger.log(`${this.taskName} completed at ${new Date().toString()}`);
    task.status = SchedulerStatus.Completed;
    task.finishedAt = new Date();

    return this._repository.save(task);
  }

  protected _error(task: SchedulerTask, error: Error | Exception): Promise<SchedulerTask> {
    this._logger.error(`${this.taskName} failed at ${new Date().toString()}`, error);
    task.status = SchedulerStatus.Failed;
    task.error = error.toString();

    return this._repository.save(task);
  }
  
}
