import { beforeAll, describe, expect, it } from '@jest/globals';
// import { getUUID } from '../src/server/utils/index';
import { Storage } from '../src/server/storages/Storage';
import { initDatabase, loadDatabaseConfig } from '../src/server/db';
import { AbstractStorage } from '../src/server/storages/abstract';
import { StorageType } from '../src/server/storages';

class TestStorage extends AbstractStorage {
  params = {
    fileSizeLimit: 1000,
  };
  type = StorageType.DB;
  init() {}
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
  // const mime = 'text/plain';
  const filename = `${name}.${ext}`;
  const file = Buffer.from('Lorem Ipsum');
  // const userId = getUUID()

  beforeAll(async () => {
    await storage.init(await initDatabase(loadDatabaseConfig()));
    storage.storages = new Map<StorageType, AbstractStorage>().set(StorageType.DB, new TestStorage());
  });

  describe('self test', () => {
    it('should explode filename', () => {
      const { ext: splittedExt, name: splittedName } = storage.splitFilename(filename);
      expect(splittedExt).toBe(ext);
      expect(splittedName).toBe(name);
    });

    it('should get extension', async () => {
      const { ext: splittedExt, mime: explodedMime } = await storage.getExt(filename, file);
      expect(splittedExt).toBe('txt');
      expect(explodedMime).toBe('text/plain');
    });

    it('should get extension', async () => {
      const hash = storage.getHash(file);
      expect(hash).toBe('6dbd01b4309de2c22b027eb35a3ce18b');
    });
  });
});
