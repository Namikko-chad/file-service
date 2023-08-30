import { Sequelize, SequelizeOptions, } from 'sequelize-typescript';

import { File, FileUser, } from '../files';
import { SchedulerTask, } from '../scheduler/scheduler.model';
import { Storage, } from '../storages/storages/database/storage.database.model';
import { GoogleDrive, } from '../storages/storages/google-drive/storage.google-drive.model';
import { DatabaseOptions, } from './database.interface';

export async function initDatabase(config: DatabaseOptions, sync = false): Promise<Sequelize> {
  let forceSync = false;
  if (!config.link && !config.host) throw new Error('Database not configured');
  const options: SequelizeOptions = {
    logging: config.logging,
    pool: {
      acquire: 9000000,
      max: 15,
    },
  };
  const uri = config.link
    ? config.link
    : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${config.dialect}://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;

  //TODO move to dynamic models
  if (sync)
    options.models = [File, FileUser, Storage, SchedulerTask, GoogleDrive];

  if (config.test && config.test_link) {
    // uri = 'sqlite::memory';
    // options.dialect = 'sqlite';
    // options.models = [File, FileUser];
    forceSync = true;
  }

  const sequelize = new Sequelize(uri, options);

  if (sequelize && (sync || forceSync)) {
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await sequelize.sync();
  }

  return sequelize;
}
