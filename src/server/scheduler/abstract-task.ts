import { Server, } from '@hapi/hapi';
import { Transaction, } from 'sequelize';

export abstract class AbstractTask {
	protected readonly logPrefix = '[Task:handler]';

  abstract interval: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(protected server: Server) {}

  public get getInterval(): string {
  	return this.interval;
  }

  abstract handler: (transaction?: Transaction) => Promise<void>;
}
