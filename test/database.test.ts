import { expect, describe, it, afterAll, jest } from '@jest/globals';
import { Sequelize } from 'sequelize-typescript';
import { initDatabase, loadDatabaseConfig, File, FileUser } from '../src/server/db';

describe('DB', () => {
  jest.setTimeout(50000);
  let db: Sequelize;

  afterAll(async () => {
    await db.close();
  });

  it('should correctly initialize the database', async () => {
    db = await initDatabase(loadDatabaseConfig());
    expect(db).toBeInstanceOf(Sequelize);
    expect(JSON.stringify(db.modelManager.models)).toBe(JSON.stringify([File, FileUser]));
  });
});
