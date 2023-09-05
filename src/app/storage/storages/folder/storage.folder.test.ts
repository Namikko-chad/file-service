import { Test, } from '@nestjs/testing';

import { beforeAll, describe, expect,it,  } from '@jest/globals';

import { File, } from '../../../files';
import { Utils, } from '../../../utils';
import { StorageFolderModule, } from './storage.folder.module';
import { FolderStorage, } from './storage.folder.service';

describe('Storage.Folder', () => {
  let storage: FolderStorage;
  const buffer = Buffer.from('test text');
  const file = new File();
  file.id = Utils.getUUID();

  beforeAll(async () => {
    process.env['FOLDER_PATH'] = '/tmp';
    const moduleRef = await Test.createTestingModule({
      imports: [StorageFolderModule],
    }).compile();

    storage = moduleRef.get<FolderStorage>(FolderStorage);
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