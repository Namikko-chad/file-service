import { Test, } from '@nestjs/testing';
import fetch from 'node-fetch';
import { v4 as uuidv4, } from 'uuid';

import { beforeAll, describe, expect, it, } from '@jest/globals';

import { FileServiceConnectorConfig, } from './config';
import { Token, } from './enum';
import { FileInfo, } from './interfaces';
import { FileServiceConnectorModule, } from './module';
import { FileServiceConnectorService, } from './service';

describe('Service', () => {
  let service: FileServiceConnectorService;
  let config: FileServiceConnectorConfig;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FileServiceConnectorModule
      ],
    }).compile();

    service = moduleRef.get<FileServiceConnectorService>(FileServiceConnectorService);
    config = moduleRef.get<FileServiceConnectorConfig>(FileServiceConnectorConfig);
  });

  describe('fileURL', () => {
    it('builds file URL', () => {
      expect(service.fileURL('test-file').href).toBe(`${config.apiUrl.toString()}files/test-file`);
    });

    it('builds file info URL', () => {
      expect(service.fileURL('test-file', 'info').href).toBe(
        `${config.apiUrl.toString()}files/test-file/info`
      );
    });
  });

  describe('getDirectLink', () => {
    it('obtains direct file link', () => {
      const directLink = service.getDirectLink({ userId: 'test-user', fileId: 'test-file', });

      expect(directLink.pathname).toBe('/api/files/test-file');
      expect(directLink.searchParams.getAll('access_token')).toEqual([expect.any(String)]);
    });
  });

  describe('token', () => {

    const userId: string = uuidv4();
    const adminId: string = uuidv4();

    describe('create tokens', () => {
      it('userAccess', () => {
        const userAccessToken = service.createToken(Token.User, { userId, });
        expect(userAccessToken).toEqual(expect.any(String));
      });

      it('adminAccess', () => {
        const adminAccessToken = service.createToken(Token.Admin, { userId: adminId, });
        expect(adminAccessToken).toEqual(expect.any(String));
      });

      it('fileAccess', () => {
        const fileAccessToken = service.createToken(Token.File, { userId, fileId: 'test', });
        expect(fileAccessToken).toEqual(expect.any(String));
      });
    });

    describe('validate tokens', () => {
      const validateResult = {
        exp: expect.any(Number),
        iat: expect.any(Number),
        timestamp: expect.any(Number),
        userId,
      };

      it('userAccess', () => {
        validateResult.userId = userId;
        const userAccessToken = service.createToken(Token.User, { userId, });
        const userAccess = service.validateToken(Token.User, userAccessToken);
        expect(userAccess).toEqual(validateResult);
      });

      it('adminAccess', () => {
        validateResult.userId = adminId;
        const adminAccessToken = service.createToken(Token.Admin, { userId: adminId, });
        const adminAccess = service.validateToken(Token.Admin, adminAccessToken);
        expect(adminAccess).toEqual(validateResult);
      });

      it('fileAccess', () => {
        validateResult.userId = userId;
        const fileAccessToken = service.createToken(Token.File, { userId, fileId: 'test', });
        const fileAccess = service.validateToken(Token.File, fileAccessToken);
        expect(fileAccess).toEqual({
          ...validateResult,
          fileId: 'test',
        });
      });
    });
  });

  describe('methods', () => {
    const fileInfo = {
      userId: '',
      id: expect.any(String),
      ext: 'txt',
      mime: 'text/plain',
      name: 'TestDocument',
      size: '9',
      public: false,
      hash: '552e21cd4cd9918678e3c1a0df491bc3',
    };
    let userId: string;
    let fileId: string;
    let data: Buffer;
    let file: FileInfo;

    beforeAll(async () => {
      userId = uuidv4();
      fileInfo.userId = userId;
      data = Buffer.from('some text');
      file = await service.create({
        userId,
        name: 'TestDocument.txt',
        mime: 'text/plain',
        data,
      });
      fileId = file.id;
    });

    it('uploads file', async () => {
      file = await service.create({
        userId,
        name: 'TestDocument.txt',
        mime: 'text/plain',
        data,
      });
      expect(file).toEqual(fileInfo);
      fileId = file.id;
    });

    it('edits file', async () => {
      await service.edit({
        fileId,
        userId,
      }, {
        name: 'updatedName.txt',
      });
      expect(file).toEqual(fileInfo);
    });

    it('get file', async () => {
      const fileId = String(file.id);
      const downloaded = await service.get({
        userId,
        fileId,
      });
      expect(data).toEqual(downloaded);
    });

    it('get file info', async () => {
      const fileId = String(file.id);
      const info = await service.info({
        userId,
        fileId,
      });
      expect(info).toEqual({
        ...fileInfo,
        name: 'updatedName',
      });
    });

    it('get file by direct link', async () => {
      const fileId = String(file.id);
      const url = service.getDirectLink({
        userId,
        fileId,
      });
      const response = await fetch(url);
      expect(response.ok).toBe(true);

      const downloaded = await response.buffer();

      expect(data).toEqual(downloaded);
    });

    it('delete file', async () => {
      const fileId = String(file.id);
      const response = await service.destroy({
        userId,
        fileId,
      });
      expect(response).toBe(true);
    });
  });
});