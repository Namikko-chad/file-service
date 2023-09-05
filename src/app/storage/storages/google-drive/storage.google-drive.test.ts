import { ConfigModule, } from '@nestjs/config';
import { Test, } from '@nestjs/testing';

import { beforeAll, describe, expect, it, jest, } from '@jest/globals';

import { DatabaseModule, } from '../../../database';
import { File, } from '../../../files';
import { Utils, } from '../../../utils';
import { GoogleDriveModule, } from './storage.google-drive.module';
import { GoogleDriveStorage, } from './storage.google-drive.service';

jest.setTimeout(10000);

describe('Storage.GoogleDrive', () => {
  let storage: GoogleDriveStorage;
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
        DatabaseModule, 
        GoogleDriveModule
      ],
    }).compile();

    storage = moduleRef.get<GoogleDriveStorage>(GoogleDriveStorage);
    await storage.init();
  });

  describe('work with file', () => {
    it('should save file', async () => {
      await expect(storage.saveFile(file, buffer)).resolves.not.toThrow();
    });

    it('should load file', async () => {
      const data = await storage.loadFile(file);
      expect(data.toString()).toEqual(buffer.toString());
    });

    it('should delete file', async () => {
      await expect(storage.deleteFile(file)).resolves.not.toThrow();
    });
  });

});