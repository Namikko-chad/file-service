import { Plugin, Server, } from '@hapi/hapi';
import { Sequelize, } from 'sequelize-typescript';
import { initDatabase, } from './handler';
import { DatabaseOptions, } from './interface';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    db: Sequelize;
  }
}

export const Database: Plugin<DatabaseOptions> = {
	name: 'database',
	register: async (server: Server, options: DatabaseOptions) => {
		server.app.db = await initDatabase(options);
	},
};
