import { describe, beforeAll, it, expect, beforeEach, } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { FolderStorage } from './storage.folder.service';
import { FileEntityGenerator } from 'app/files/generators/file.generator';
import { StorageFolderModule } from './storage.folder.module';

describe('Storage.Folder', () => {
  let storage: FolderStorage;
  const file = FileEntityGenerator.create();
  const buffer = Buffer.from('test text');

  beforeAll(() => {
    process.env['FOLDER_PATH'] = '/tmp';
  })

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [StorageFolderModule]
      }).compile();

    storage = moduleRef.get<FolderStorage>(FolderStorage);
  });

  describe('work with file', () => {
    it('should save file', async () => {
      await storage.saveFile(file, buffer);
    });

    it('should load file', async () => {
      const data = await storage.loadFile(file);
      expect(data.toString()).toEqual(buffer.toString())
    });

    it('should delete file', async () => {
      await storage.deleteFile(file);
    });
  });

})