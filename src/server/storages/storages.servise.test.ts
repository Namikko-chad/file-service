import { Sequelize, } from 'sequelize-typescript';

import { afterAll, beforeAll, describe, expect, it, jest, } from '@jest/globals';

import { initDatabase, loadDatabaseConfig, } from '../database';
import { Storage, } from './storages.service';
import { AbstractStorageConfig, } from './storages/storage.abstract.config';
import { AbstractStorage, } from './storages/storage.abstract.service';

jest.setTimeout(20000);

class TestStorage extends AbstractStorage {
  params = {
    fileSizeLimit: 1000,
  };
  init(): Promise<void> {
    return Promise.resolve();
  }
  close(): Promise<void> {
    return Promise.resolve();
  }
  saveFile(): Promise<void> {
    return Promise.resolve();
  }
  loadFile(): Promise<Buffer> {
    return Promise.resolve(Buffer.from(''));
  }
  deleteFile(): Promise<void> {
    return Promise.resolve();
  }
}

describe('Storage', () => {
  const storage = new Storage();
  const ext = 'txt';
  const name = 'lorem';
  const filename = `${name}.${ext}`;
  const file = Buffer.from('Lorem Ipsum');
  let db: Sequelize;

  beforeAll(async () => {
    db = await initDatabase(loadDatabaseConfig());
    await storage.init(db);
    storage.storages = new Map<string, AbstractStorage>().set(TestStorage.name, new TestStorage(new AbstractStorageConfig()));
  });

  afterAll(async () => {
    const stor = storage.storages.get('megaio');
    await stor?.close();
    await db.close();
  });

  describe('self test', () => {
    it('should explode filename', () => {
      const { ext: splittedExt, name: splittedName, } = storage.splitFilename(filename);
      expect(splittedExt).toBe(ext);
      expect(splittedName).toBe(name);
    });

    it('should get extension', async () => {
      const { ext: splittedExt, mime: explodedMime, } = await storage.getExt(filename, file);
      expect(splittedExt).toBe('txt');
      expect(explodedMime).toBe('text/plain');
    });

    it('should get hash', async () => {
      const hash = storage.getHash(file);
      expect(hash).toBe('6dbd01b4309de2c22b027eb35a3ce18b');
    });
  });
});
