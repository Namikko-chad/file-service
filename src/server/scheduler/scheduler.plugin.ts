import { Plugin, Server, } from '@hapi/hapi';

import { SchedulerTask, } from './model';
import { SchedulerHandler, } from './scheduler.handler';
import { DeleteOldLogsTask, } from './task.delete-old-logs';
import { DeleteUnboundFileTask, } from './task.delete-unbound-file';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    scheduler: SchedulerHandler;
  }
}

export enum TaskList {
  DeleteUnboundFile = 'delete-unbound-file',
  DeleteOldLogs = 'delete-old-logs',
}

export const SchedulerPlugin: Plugin<unknown> = {
  name: 'schedulerPlugin',
  async register(server: Server): Promise<void> {
    server.app.db.addModels([SchedulerTask]);
    await server.app.db.showAllSchemas({});
    await server.app.db.createSchema('logs', {});
    await server.app.db.sync();
    server.app.scheduler = new SchedulerHandler(server);
    server.app.scheduler.registerTask(TaskList.DeleteUnboundFile, new DeleteUnboundFileTask(server));
    server.app.scheduler.registerTask(TaskList.DeleteOldLogs, new DeleteOldLogsTask(server));
  },
  dependencies: ['database'],
};
