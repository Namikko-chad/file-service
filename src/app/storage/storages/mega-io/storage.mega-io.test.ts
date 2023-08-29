import { describe, it, expect, beforeEach, beforeAll, } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { MegaIOStorage } from './storage.mega-io.service';
import { FileEntityGenerator } from 'app/files/generators/file.generator';
import { ConfigModule } from '@nestjs/config';
import { MegaIOModule } from './storage.mega-io.module';

describe('Storage.MegaIO', () => {
  let storage: MegaIOStorage;
  const buffer = Buffer.from('test text');
  const file = FileEntityGenerator.create();

  beforeAll(() => {
    process.env['NODE_ENV'] = 'test';
  } )

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MegaIOModule
      ],
      }).compile();

    storage = moduleRef.get<MegaIOStorage>(MegaIOStorage);
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