import { Module, } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';
import { ScheduleModule, } from '@nestjs/schedule';

import { AuthModule, } from './auth/auth.module';
import { ControlModule, } from './control/control.module';
import { DatabaseModule, } from './database/database.module';
// import { FileModule, } from './files/files.module';
import { SchedulerTasksModule, } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    SchedulerTasksModule,
    AuthModule,
    // FileModule,
    ControlModule
  ],
})
export class AppModule {}
