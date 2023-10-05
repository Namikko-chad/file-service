import { ConfigModule, } from '@nestjs/config';
import { Test, } from '@nestjs/testing';

import { afterAll, beforeAll, describe, expect, it, jest, } from '@jest/globals';

import { File, } from '../../../files';
import { Utils, } from '../../../utils';
import { MegaIOModule, } from './storage.mega-io.module';
import { MegaIOStorage, } from './storage.mega-io.service';

jest.setTimeout(20000);

describe('Storage.MegaIO', () => {
  let storage: MegaIOStorage;
  const buffer = Buffer.from('test text');
  const file = new File();
  file.id = Utils.getUUID();

  beforeAll(async () => {
    process.env['NODE_ENV'] = 'test';
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MegaIOModule
      ],
    }).compile();

    storage = moduleRef.get<MegaIOStorage>(MegaIOStorage);
    await storage.init();
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('work with file', () => {
    it('should save file', async () => {
      await expect(storage.saveFile(file, buffer)).resolves.not.toThrow();
    });

    it('should load file', async () => {
      const data = await storage.loadFile(file);
      expect(data.toString()).toBe('test text');
    });

    it('should delete file', async () => {
      await expect(storage.deleteFile(file)).resolves.not.toThrow();
    });
  });

});