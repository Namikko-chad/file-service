import { Server, } from '@hapi/hapi';
import cron from 'node-cron';
import { AbstractTask, } from './abstract-task';
import { TaskList, } from './scheduler.plugin';
import { Scheduler, } from './model';
import { SchedulerStatus, } from './enum';

export class SchedulerHandler {
	private tasks = new Map<TaskList, AbstractTask>();

	constructor(private server: Server) {}

	init(): this {
		const logPrefix = '[Scheduler:init]';
		console.log(logPrefix, 'Scheduling task');
		Object.values(TaskList).map((taskName) => {
			if (this.tasks.has(taskName)) {
				const task = this.tasks.get(taskName);
				if (!task) throw new ReferenceError('Unknown task');
				console.log(
					logPrefix,
					`Add ${taskName} task with interval ${task.getInterval}`
				);
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				cron.schedule(task.getInterval, async () => {
					try {
						await this.runTask(task);
					} catch (err) {
						console.error(logPrefix, err);
					}
				});
			} else console.error(logPrefix, `${taskName} not configured`);
		});
		return this;
	}

	public registerTask(task: TaskList, worker: AbstractTask): void {
		const logPrefix = '[Scheduler:registerTask]';
		console.log(logPrefix, task);
		this.tasks.set(task, worker);
	}

	private async runTask(task: AbstractTask) {
		const logPrefix = '[Scheduler:runTask]';
		const taskName = task.constructor.name;
		console.log(logPrefix, `${taskName} running at ${new Date().toString()}`);
		const { id, } = await Scheduler.create({
			name: taskName,
		});
		const transaction = await this.server.app.db.transaction();
		try {
			await task.handler(this.server, transaction);
			await transaction.commit();
			console.log(
				logPrefix,
				`${taskName} completed at ${new Date().toString()}`
			);
			await Scheduler.update(
				{
					status: SchedulerStatus.Completed,
					endedAt: new Date(),
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
			await Scheduler.update(
				{
					status: SchedulerStatus.Failed,
					endedAt: new Date(),
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
