import { Transaction, } from 'sequelize';

import { Server, } from '@hapi/hapi';

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
