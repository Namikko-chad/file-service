import { Sequelize, } from 'sequelize-typescript';

import { afterAll, describe, expect, it, jest, } from '@jest/globals';

import { loadDatabaseConfig, } from './database.config';
import { initDatabase, } from './database.handler';

describe('DB', () => {
  jest.setTimeout(50000);
  let db: Sequelize;

  afterAll(async () => {
    await db.close();
  });

  it('should correctly initialize the database', async () => {
    db = await initDatabase(loadDatabaseConfig());
    expect(db).toBeInstanceOf(Sequelize);
    expect(JSON.stringify(db.modelManager.models)).toBe(JSON.stringify([]));
  });
});
