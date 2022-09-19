import { Plugin, Server, } from '@hapi/hapi';
import { SchedulerHandler, } from './scheduler.handler';
import { Scheduler, } from './model';
import { DeleteUnboundFileTask, } from './task.delete-unbound-file';

export enum TaskList {
  DeleteUnboundFile = 'delete-unbound-file',
}

export const SchedulerPlugin: Plugin<unknown> = {
	name: 'schedulerPlugin',
	async register(server: Server): Promise<void> {
		server.app.db.addModels([Scheduler]);
		await server.app.db.showAllSchemas({});
		await server.app.db.createSchema('logs', {});
		await server.app.db.sync();
		const scheduler = new SchedulerHandler(server);
		scheduler.registerTask(
			TaskList.DeleteUnboundFile,
			new DeleteUnboundFileTask(server)
		);
		scheduler.init();
	},
	dependencies: ['database'],
};
