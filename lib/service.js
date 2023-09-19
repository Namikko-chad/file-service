"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileServiceConnectorService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const form_data_1 = __importDefault(require("form-data"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("url");
const config_1 = require("./config");
const enum_1 = require("./enum");
let FileServiceConnectorService = class FileServiceConnectorService {
    logger = new common_1.Logger('File-service');
    jwtService;
    config;
    fileURL(fileId, route) {
        let path = `files/${fileId}`;
        if (route) {
            path += `/${route}`;
        }
        return new url_1.URL(path, this.config.apiUrl);
    }
    getDirectLink(_cred) {
        const url = this.fileURL(_cred.fileId);
        url.searchParams.set('access_token', this.createToken(enum_1.Token.File, _cred));
        return url;
    }
    createToken(_tokenType, _cred) {
        const data = {
            ..._cred,
            timestamp: Date.now(),
        };
        const { secret, expired: expiresIn, } = this.config[_tokenType];
        return this.jwtService.sign(data, { secret, expiresIn, });
    }
    validateToken(_tokenType, _token) {
        const secret = this.config[_tokenType].secret;
        try {
            return this.jwtService.verify(_token, { secret, });
        }
        catch (e) {
            throw Error('Token invalid');
        }
    }
    async create(file) {
        const url = new url_1.URL('files', this.config.apiUrl);
        const { ...info } = file;
        const logPrefix = `[file-service:${url.href}]`;
        const body = new form_data_1.default();
        this.logger.debug(`${logPrefix} Creating`, info);
        if (file.public) {
            body.append('public', String(file.public));
        }
        if (file.data)
            body.append('file', file.data, {
                filename: file.name,
                contentType: file.mime,
            });
        this.logger.debug(`${logPrefix} Creating`, info);
        const response = await (0, node_fetch_1.default)(url, {
            method: 'POST',
            body: body,
            headers: { Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: info.userId, }), },
        });
        const responseText = await response.text();
        if (!response.ok) {
            this.logger.error(`${logPrefix} Failed to create`, info, 'Status:', response.status, 'Response:', responseText);
            throw new Error(`Failed to create ${file.name} for ${file.userId}`);
        }
        const { result, } = JSON.parse(responseText);
        this.logger.debug(`${logPrefix} Created`, responseText);
        return result;
    }
    async edit(cred, file) {
        const url = this.fileURL(cred.fileId);
        const { ...info } = file;
        const logPrefix = `[file-service:${url.href}]`;
        this.logger.debug(`${logPrefix} Editing`, info);
        const response = await (0, node_fetch_1.default)(url, {
            method: 'PUT',
            body: JSON.stringify(file),
            headers: {
                Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId, }),
                'Content-Type': 'application/json',
            },
        });
        const responseText = await response.text();
        if (!response.ok) {
            this.logger.error(`${logPrefix} Failed to edit`, info, 'Status:', response.status, 'Response:', responseText);
            throw new Error(`Failed to edit ${file.name} for ${cred.fileId}`);
        }
        const { result, } = JSON.parse(responseText);
        this.logger.debug(`${logPrefix} Edited`, responseText);
    }
    async get(cred) {
        const url = this.fileURL(cred.fileId);
        const logPrefix = `[file-service:${url.href}]`;
        this.logger.debug(`${logPrefix} Downloading`);
        const response = await (0, node_fetch_1.default)(url, {
            headers: { Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId, }), },
        });
        if (!response.ok) {
            this.logger.error(`${logPrefix} Failed to download. Status:`, response.status, 'Response:', await response.text());
            throw new Error(`Failed to download file ${url.href}`);
        }
        const buffer = await response.buffer();
        this.logger.debug(`${logPrefix} Downloaded`, buffer.length, 'bytes');
        return buffer;
    }
    async info(cred) {
        const url = this.fileURL(cred.fileId, 'info');
        const logPrefix = `[file-service:${url.href}]`;
        this.logger.debug(`${logPrefix} Get info`);
        const response = await (0, node_fetch_1.default)(url, {
            headers: { Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId, }), },
        });
        if (!response.ok) {
            this.logger.error(`${logPrefix} Failed to get info. Status:`, response.status, 'Response:', await response.text());
            throw new Error(`Failed to get info file ${url.href}`);
        }
        const { result: info, } = (await response.json());
        this.logger.debug(`${logPrefix} Received`);
        return info;
    }
    async destroy(cred) {
        const url = this.fileURL(cred.fileId);
        const logPrefix = `[file-service:${url.href}]`;
        this.logger.debug(`${logPrefix} Destroying`);
        const response = await (0, node_fetch_1.default)(url, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId, }), },
        });
        if (!response.ok) {
            this.logger.error(`${logPrefix} Failed to destroy. Status:`, response.status, 'Response:', await response.text());
            throw new Error(`Failed to destroy file ${url.href}`);
        }
        this.logger.debug(`${logPrefix} Destroyed`);
        return true;
    }
};
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], FileServiceConnectorService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(config_1.FileServiceConnectorConfig),
    __metadata("design:type", config_1.FileServiceConnectorConfig)
], FileServiceConnectorService.prototype, "config", void 0);
FileServiceConnectorService = __decorate([
    (0, common_1.Injectable)()
], FileServiceConnectorService);
exports.FileServiceConnectorService = FileServiceConnectorService;
//# sourceMappingURL=service.js.map