import { Sequelize, } from 'sequelize-typescript';

import { afterAll, beforeAll, describe, expect, it, jest,  } from '@jest/globals';

import { initDatabase, loadDatabaseConfig, } from '../../../database';
import { File, FileGenerator, } from '../../../files';
import { MegaIOStorage, } from './storage.mega-io.service';

jest.setTimeout(10000);

describe('Storage.MegaIO', () => {
  const buffer = Buffer.from('test text');
  let db: Sequelize;
  let storage: MegaIOStorage;
  let fileGenerator: FileGenerator;
  let file: File;

  beforeAll(async () => {
    db = await initDatabase(loadDatabaseConfig());
    fileGenerator = new FileGenerator(db);
    file = await fileGenerator.create();
    storage = new MegaIOStorage();
    await storage.init(db);
  });

  afterAll(async () => {
    await db.close();
  });

  describe('work with file', () => {
    it('should save file', async () => {
      await expect(storage.saveFile(file, buffer)).resolves.not.toThrow();
    });

    it('should load file', async () => {
      const data = await storage.loadFile(file);
      expect(data.toString('utf-8')).toEqual(buffer.toString());
    });

    it('should delete file', async () => {
      await expect(storage.deleteFile(file)).resolves.not.toThrow();
    });
  });

});