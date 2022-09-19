import { Plugin, Server, } from '@hapi/hapi';
import { SchedulerTask, } from './model';
import { SchedulerHandler, } from './scheduler.handler';
import { DeleteUnboundFileTask, } from './task.delete-unbound-file';
import { DeleteOldLogsTask, } from './task.delete-old-logs';

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
		const scheduler = new SchedulerHandler(server);
		scheduler.registerTask(
			TaskList.DeleteUnboundFile,
			new DeleteUnboundFileTask(server)
		);
		scheduler.registerTask(
			TaskList.DeleteOldLogs,
			new DeleteOldLogsTask(server)
		);
		scheduler.init();
	},
	dependencies: ['database'],
};
