import { describe, it, expect, beforeEach, beforeAll, } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { DBStorage } from './storage.database.service';
import { FileEntityGenerator } from 'app/files/generators/file.generator';
import { StorageDatabaseModule } from './storage.database.module';
import { DatabaseModule } from 'app/database/database.module';
import { ConfigModule } from '@nestjs/config';

describe('Storage.Database', () => {
  let storage: DBStorage;
  const buffer = Buffer.from('test text');
  const file = FileEntityGenerator.create();

  beforeAll(() => {
    process.env['MODE'] = 'test';
  } )

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule, 
        StorageDatabaseModule
      ],
      }).compile();

    storage = moduleRef.get<DBStorage>(DBStorage);
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