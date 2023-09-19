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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileServiceConnectorConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let FileServiceConnectorConfig = class FileServiceConnectorConfig {
    _config;
    apiUrl;
    file;
    user;
    admin;
    constructor(_config) {
        this._config = _config;
        let apiUrl = this._config.get('FILE_SERVICE_URL') || 'localhost:3050';
        apiUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
        this.apiUrl = new URL(apiUrl);
        this.file = {
            secret: this._config.getOrThrow('FA_SECRET'),
            expired: this._config.get('FA_LIFETIME') || 900000,
        };
        this.user = {
            secret: this._config.getOrThrow('UA_SECRET'),
            expired: this._config.get('UA_LIFETIME') || 60 * 60 * 24 * 3 * 1000,
        };
        this.admin = {
            secret: this._config.getOrThrow('AA_SECRET'),
            expired: this._config.get('AA_LIFETIME') || 60 * 60 * 24 * 3 * 1000,
        };
    }
};
FileServiceConnectorConfig = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_1.ConfigService)),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileServiceConnectorConfig);
exports.FileServiceConnectorConfig = FileServiceConnectorConfig;
//# sourceMappingURL=config.js.map