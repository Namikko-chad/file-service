import { Module, } from '@nestjs/common';

import { DeleteOldLogsTask, } from './task.delete-old-logs';

@Module({
  providers: [DeleteOldLogsTask],
})
export class SchedulerTasksModule {}
