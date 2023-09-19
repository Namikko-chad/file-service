"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const node_fetch_1 = __importDefault(require("node-fetch"));
const uuid_1 = require("uuid");
const globals_1 = require("@jest/globals");
const config_1 = require("./config");
const enum_1 = require("./enum");
const module_1 = require("./module");
const service_1 = require("./service");
(0, globals_1.describe)('Service', () => {
    let service;
    let config;
    (0, globals_1.beforeAll)(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                module_1.FileServiceConnectorModule
            ],
        }).compile();
        service = moduleRef.get(service_1.FileServiceConnectorService);
        config = moduleRef.get(config_1.FileServiceConnectorConfig);
    });
    (0, globals_1.describe)('fileURL', () => {
        (0, globals_1.it)('builds file URL', () => {
            (0, globals_1.expect)(service.fileURL('test-file').href).toBe(`${config.apiUrl.toString()}files/test-file`);
        });
        (0, globals_1.it)('builds file info URL', () => {
            (0, globals_1.expect)(service.fileURL('test-file', 'info').href).toBe(`${config.apiUrl.toString()}files/test-file/info`);
        });
    });
    (0, globals_1.describe)('getDirectLink', () => {
        (0, globals_1.it)('obtains direct file link', () => {
            const directLink = service.getDirectLink({ userId: 'test-user', fileId: 'test-file', });
            (0, globals_1.expect)(directLink.pathname).toBe('/api/files/test-file');
            (0, globals_1.expect)(directLink.searchParams.getAll('access_token')).toEqual([globals_1.expect.any(String)]);
        });
    });
    (0, globals_1.describe)('token', () => {
        const userId = (0, uuid_1.v4)();
        const adminId = (0, uuid_1.v4)();
        (0, globals_1.describe)('create tokens', () => {
            (0, globals_1.it)('userAccess', () => {
                const userAccessToken = service.createToken(enum_1.Token.User, { userId, });
                (0, globals_1.expect)(userAccessToken).toEqual(globals_1.expect.any(String));
            });
            (0, globals_1.it)('adminAccess', () => {
                const adminAccessToken = service.createToken(enum_1.Token.Admin, { userId: adminId, });
                (0, globals_1.expect)(adminAccessToken).toEqual(globals_1.expect.any(String));
            });
            (0, globals_1.it)('fileAccess', () => {
                const fileAccessToken = service.createToken(enum_1.Token.File, { userId, fileId: 'test', });
                (0, globals_1.expect)(fileAccessToken).toEqual(globals_1.expect.any(String));
            });
        });
        (0, globals_1.describe)('validate tokens', () => {
            const validateResult = {
                exp: globals_1.expect.any(Number),
                iat: globals_1.expect.any(Number),
                timestamp: globals_1.expect.any(Number),
                userId,
            };
            (0, globals_1.it)('userAccess', () => {
                validateResult.userId = userId;
                const userAccessToken = service.createToken(enum_1.Token.User, { userId, });
                const userAccess = service.validateToken(enum_1.Token.User, userAccessToken);
                (0, globals_1.expect)(userAccess).toEqual(validateResult);
            });
            (0, globals_1.it)('adminAccess', () => {
                validateResult.userId = adminId;
                const adminAccessToken = service.createToken(enum_1.Token.Admin, { userId: adminId, });
                const adminAccess = service.validateToken(enum_1.Token.Admin, adminAccessToken);
                (0, globals_1.expect)(adminAccess).toEqual(validateResult);
            });
            (0, globals_1.it)('fileAccess', () => {
                validateResult.userId = userId;
                const fileAccessToken = service.createToken(enum_1.Token.File, { userId, fileId: 'test', });
                const fileAccess = service.validateToken(enum_1.Token.File, fileAccessToken);
                (0, globals_1.expect)(fileAccess).toEqual({
                    ...validateResult,
                    fileId: 'test',
                });
            });
        });
    });
    (0, globals_1.describe)('methods', () => {
        const fileInfo = {
            userId: '',
            id: globals_1.expect.any(String),
            ext: 'txt',
            mime: 'text/plain',
            name: 'TestDocument',
            size: '9',
            public: false,
            hash: '552e21cd4cd9918678e3c1a0df491bc3',
        };
        let userId;
        let fileId;
        let data;
        let file;
        (0, globals_1.beforeAll)(async () => {
            userId = (0, uuid_1.v4)();
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
        (0, globals_1.it)('uploads file', async () => {
            file = await service.create({
                userId,
                name: 'TestDocument.txt',
                mime: 'text/plain',
                data,
            });
            (0, globals_1.expect)(file).toEqual(fileInfo);
            fileId = file.id;
        });
        (0, globals_1.it)('edits file', async () => {
            await service.edit({
                fileId,
                userId,
            }, {
                name: 'updatedName.txt',
            });
            (0, globals_1.expect)(file).toEqual(fileInfo);
        });
        (0, globals_1.it)('get file', async () => {
            const fileId = String(file.id);
            const downloaded = await service.get({
                userId,
                fileId,
            });
            (0, globals_1.expect)(data).toEqual(downloaded);
        });
        (0, globals_1.it)('get file info', async () => {
            const fileId = String(file.id);
            const info = await service.info({
                userId,
                fileId,
            });
            (0, globals_1.expect)(info).toEqual({
                ...fileInfo,
                name: 'updatedName',
            });
        });
        (0, globals_1.it)('get file by direct link', async () => {
            const fileId = String(file.id);
            const url = service.getDirectLink({
                userId,
                fileId,
            });
            const response = await (0, node_fetch_1.default)(url);
            (0, globals_1.expect)(response.ok).toBe(true);
            const downloaded = await response.buffer();
            (0, globals_1.expect)(data).toEqual(downloaded);
        });
        (0, globals_1.it)('delete file', async () => {
            const fileId = String(file.id);
            const response = await service.destroy({
                userId,
                fileId,
            });
            (0, globals_1.expect)(response).toBe(true);
        });
    });
});
//# sourceMappingURL=service.test.js.map