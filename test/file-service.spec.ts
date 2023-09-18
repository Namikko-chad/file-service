import { beforeAll, describe, expect, it } from '@jest/globals';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { loadFileServiceConfig } from '../src/config';
import { Token } from '../src/enum';
import { FileServiceHandler } from '../src/handler';
import { FileInfo, FileServiceOptions } from '../src/interfaces';

const DOCX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

describe('FileService plugin', () => {
	let fileService: FileServiceHandler;
	const options: FileServiceOptions = loadFileServiceConfig();

	beforeAll(() => {
		fileService = new FileServiceHandler(options);
	});

	describe('fileURL', () => {
		it('builds file URL', () => {
			expect(fileService.fileURL('test-file').href).toBe(options.apiUrl + '/files/test-file');
		});

		it('builds file info URL', () => {
			expect(fileService.fileURL('test-file', 'info').href).toBe(
				options.apiUrl + '/files/test-file/info',
			);
		});
	});

	describe('getDirectLink', () => {
		it('obtains direct file link', () => {
			const directLink = fileService.getDirectLink({ userId: 'test-user', fileId: 'test-file' });

			expect(directLink.pathname).toBe('/api/files/test-file');
			expect(directLink.searchParams.getAll('access_token')).toEqual([expect.any(String)]);
		});
	});

	describe('token', () => {
		let fileAccessToken: string;
		let userAccessToken: string;
		let adminAccessToken: string;

		let userId: string = uuidv4();
		let adminId: string = uuidv4();

		describe('create tokens', () => {
			it('userAccess', () => {
				userAccessToken = fileService.createToken(Token.User, { userId });
				expect(userAccessToken).toEqual(expect.any(String));
			});

			it('adminAccess', () => {
				adminAccessToken = fileService.createToken(Token.Admin, { userId: adminId });
				expect(adminAccessToken).toEqual(expect.any(String));
			});

			it('fileAccess', () => {
				fileAccessToken = fileService.createToken(Token.File, { userId, fileId: 'test' });
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
				const userAccess = fileService.validateToken(Token.User, userAccessToken);

				expect(userAccess).toEqual(validateResult);
			});

			it('adminAccess', () => {
				validateResult.userId = adminId;
				const adminAccess = fileService.validateToken(Token.Admin, adminAccessToken);

				expect(adminAccess).toEqual(validateResult);
			});

			it('fileAccess', () => {
				validateResult.userId = userId;
				const fileAccess = fileService.validateToken(Token.File, fileAccessToken);
				console.log(fileAccess);
				expect(fileAccess).toEqual({
					exp: expect.any(Number),
					iat: expect.any(Number),
					timestamp: expect.any(Number),
					userId,
					fileId: 'test',
				});
			});
		});
	});

	describe('methods', () => {
		const fileInfo = {
			userId: '',
			id: expect.any(String),
			ext: 'docx',
			mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			name: 'TestDocument',
			public: false,
			hash: expect.any(String),
		};
		let userId: string;
		let fileId: string;
		let data: Buffer;
		let file: FileInfo;

		beforeAll(async () => {
			userId = uuidv4();
			fileInfo.userId = userId;
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			data = await fs.readFile(path.resolve('test', 'files_for_test', 'test.docx'));
		});

		it('uploads file', async () => {
			file = await fileService.create({
				userId,
				name: 'TestDocument.docx',
				mime: DOCX_MIME_TYPE,
				data,
			});
			console.log(file);
			expect(file).toEqual(fileInfo);
			fileId = file.id;
		});

		it('edits file', async () => {
			file = await fileService.edit({
				fileId,
				userId,
				name: 'TestDocument.docx',
				mime: DOCX_MIME_TYPE,
				data,
			});
			expect(file).toEqual(fileInfo);
		});

		it('get file', async () => {
			const fileId = String(file.id);
			const downloaded = await fileService.get({
				userId,
				fileId,
			});
			expect(data).toEqual(downloaded);
		});

		it('get file info', async () => {
			const fileId = String(file.id);
			const info = await fileService.info({
				userId,
				fileId,
			});
			expect(info).toEqual(fileInfo);
		});

		it('get file by direct link', async () => {
			const fileId = String(file.id);
			const url = fileService.getDirectLink({
				userId,
				fileId,
			});
			const response = await fetch(url);
			console.log(response);
			expect(response.ok).toBe(true);

			const downloaded = await response.buffer();

			expect(data).toEqual(downloaded);
		});

		it('delete file', async () => {
			const fileId = String(file.id);
			const response = await fileService.destroy({
				userId,
				fileId,
			});
			expect(response).toBe(true);
		});
	});
});
