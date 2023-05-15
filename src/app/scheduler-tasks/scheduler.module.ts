import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { File, } from 'app/files/entity';
import { FileRepository, } from 'app/files/repositories';
import { StorageModule, } from 'app/storage/storage.module';

import { SchedulerTask, } from './scheduler.entity';
import { SchedulerTaskRepository, } from './scheduler.repository';
import { DeleteOldLogsTask, } from './task.delete-old-logs';
import { DeleteUnboundFileTask, } from './task.delete-unbound-file';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulerTask, File]), StorageModule],
  providers: [FileRepository, SchedulerTaskRepository, DeleteOldLogsTask, DeleteUnboundFileTask],
})
export class SchedulerTasksModule {}
