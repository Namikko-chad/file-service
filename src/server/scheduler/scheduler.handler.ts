import { Server, } from '@hapi/hapi';
import cron from 'node-cron';
import { AbstractTask, } from './abstract-task';
import { TaskList, } from './scheduler.plugin';
import { SchedulerTask, } from './model';
import { SchedulerStatus, } from './enum';

export class SchedulerHandler {
	private tasks = new Map<TaskList | string, AbstractTask>();

	constructor(private server: Server) {}

	public init(): this {
		const logPrefix = '[Scheduler:init]';
		console.log(logPrefix, 'Scheduling task');
		this.tasks.forEach( (task) => {
			if (!task) throw new ReferenceError('Unknown task');
			console.log(
				logPrefix,
				`Add ${task.constructor.name} task with interval ${task.getInterval}`
			);
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			cron.schedule(task.getInterval, async () => {
				try {
					await this.runTask(task);
				} catch (err) {
					console.error(logPrefix, err);
				}
			});
		});
		return this;
	}

	public registerTask(task: TaskList | string, worker: AbstractTask): void {
		const logPrefix = '[Scheduler:registerTask]';
		console.log(logPrefix, task);
		this.tasks.set(task, worker);
	}

	private async runTask(task: AbstractTask) {
		const logPrefix = '[Scheduler:runTask]';
		const taskName = task.constructor.name;
		console.log(logPrefix, `${taskName} running at ${new Date().toString()}`);
		const { id, } = await SchedulerTask.create({
			name: taskName,
		});
		const transaction = await this.server.app.db.transaction();
		try {
			await task.handler(transaction);
			await transaction.commit();
			console.log(
				logPrefix,
				`${taskName} completed at ${new Date().toString()}`
			);
			await SchedulerTask.update(
				{
					status: SchedulerStatus.Completed,
					finishedAt: new Date(),
				},
				{
					where: {
						id,
					},
				}
			);
		} catch (error) {
			void transaction.rollback();
			console.error(
				logPrefix,
				`${taskName} failed at ${new Date().toString()}`,
				error
			);
			await SchedulerTask.update(
				{
					status: SchedulerStatus.Failed,
					finishedAt: new Date(),
					error: (error as Error).toString(),
				},
				{
					where: {
						id,
					},
				}
			);
		}
	}
}
