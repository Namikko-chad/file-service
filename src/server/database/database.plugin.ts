import { Sequelize, } from 'sequelize-typescript';

import { Plugin, Server, } from '@hapi/hapi';

import { config, } from '../config';
import { initDatabase, } from './database.handler';
import { DatabaseOptions, } from './database.interface';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    db: Sequelize;
  }
}

export const Database: Plugin<DatabaseOptions> = {
  name: 'database',
  register: async (server: Server, options: DatabaseOptions) => {
    server.app.db = await initDatabase(options);
    config.db = server.app.db;
  },
};
