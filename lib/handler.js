'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.FileServiceHandler = void 0;
const form_data_1 = __importDefault(require('form-data'));
const jsonwebtoken_1 = require('jsonwebtoken');
const node_fetch_1 = __importDefault(require('node-fetch'));
const url_1 = require('url');
const enum_1 = require('./enum');
class FileServiceHandler {
	constructor(_options) {
		const { apiUrl, fileAccess, userAccess, adminAccess } = _options;
		this.apiUrl = new url_1.URL(apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`);
		const { expired: fileAccessExpiresIn = 900000 } = fileAccess;
		this.fileAccess = {
			...fileAccess,
			expired: fileAccessExpiresIn,
		};
		const { expired: userAccessExpiresIn = 60 * 60 * 24 * 3 * 1000 } = userAccess;
		this.userAccess = {
			...userAccess,
			expired: userAccessExpiresIn,
		};
		const { expired: adminAccessExpiresIn = 60 * 60 * 24 * 3 * 1000 } = adminAccess;
		this.adminAccess = {
			...adminAccess,
			expired: adminAccessExpiresIn,
		};
	}
	fileURL(fileId, route) {
		let path = `files/${fileId}`;
		if (route) {
			path += `/${route}`;
		}
		return new url_1.URL(path, this.apiUrl);
	}
	getDirectLink(_cred) {
		const url = this.fileURL(_cred.fileId);
		url.searchParams.set('access_token', this.createToken(enum_1.Token.File, _cred));
		return url;
	}
	filePostBody(_file) {
		const body = new form_data_1.default();
		if (_file.public) {
			body.append('public', String(_file.public));
		}
		body.append('file', _file.data, {
			filename: _file.name,
			contentType: _file.mime,
		});
		return body;
	}
	createToken(_tokenType, _cred) {
		const data = {
			..._cred,
			timestamp: Date.now(),
		};
		let secret;
		let expiresIn;
		switch (_tokenType) {
			case enum_1.Token.File:
				secret = this.fileAccess.secret;
				expiresIn = this.fileAccess.expired;
				break;
			case enum_1.Token.User:
				secret = this.userAccess.secret;
				expiresIn = this.userAccess.expired;
				break;
			case enum_1.Token.Admin:
				secret = this.adminAccess.secret;
				expiresIn = this.adminAccess.expired;
				break;
		}
		return (0, jsonwebtoken_1.sign)(data, secret, { expiresIn });
	}
	validateToken(_tokenType, _token) {
		let secret;
		switch (_tokenType) {
			case enum_1.Token.File:
				secret = this.fileAccess.secret;
				break;
			case enum_1.Token.User:
				secret = this.userAccess.secret;
				break;
			case enum_1.Token.Admin:
				secret = this.adminAccess.secret;
				break;
		}
		try {
			return (0, jsonwebtoken_1.verify)(_token, secret);
		} catch (e) {
			throw Error('Token invalid');
		}
	}
	async create(file) {
		const url = new url_1.URL('files', this.apiUrl);
		const { ...info } = file;
		const logPrefix = `[file-service:${url.href}]`;
		console.debug(`${logPrefix} Creating`, info);
		const response = await (0, node_fetch_1.default)(url, {
			method: 'POST',
			body: this.filePostBody(file),
			headers: {
				Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: info.userId }),
			},
		});
		const responseText = await response.text();
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to create`,
				info,
				'Status:',
				response.status,
				'Response:',
				responseText,
			);
			throw new Error(`Failed to create ${file.name} for ${file.userId}`);
		}
		const { result } = JSON.parse(responseText);
		console.debug(`${logPrefix} Created`, responseText);
		return result;
	}
	async edit(file) {
		const url = this.fileURL(file.fileId);
		const { ...info } = file;
		const logPrefix = `[file-service:${url.href}]`;
		console.debug(`${logPrefix} Editing`, info);
		const response = await (0, node_fetch_1.default)(url, {
			method: 'PUT',
			body: this.filePostBody(file),
			headers: {
				Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: info.userId }),
			},
		});
		const responseText = await response.text();
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to edit`,
				info,
				'Status:',
				response.status,
				'Response:',
				responseText,
			);
			throw new Error(`Failed to edit ${file.name} for ${file.userId}`);
		}
		const { result } = JSON.parse(responseText);
		console.debug(`${logPrefix} Edited`, responseText);
		return result;
	}
	async get(cred) {
		const url = this.fileURL(cred.fileId);
		const logPrefix = `[file-service:${url.href}]`;
		console.debug(`${logPrefix} Downloading`);
		const response = await (0, node_fetch_1.default)(url, {
			headers: {
				Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId }),
			},
		});
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to download. Status:`,
				response.status,
				'Response:',
				await response.text(),
			);
			throw new Error(`Failed to download file ${url.href}`);
		}
		const buffer = await response.buffer();
		console.debug(`${logPrefix} Downloaded`, buffer.length, 'bytes');
		return buffer;
	}
	async info(cred) {
		const url = this.fileURL(cred.fileId, 'info');
		const logPrefix = `[file-service:${url.href}]`;
		console.debug(`${logPrefix} Get info`);
		const response = await (0, node_fetch_1.default)(url, {
			headers: {
				Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId }),
			},
		});
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to get info. Status:`,
				response.status,
				'Response:',
				await response.text(),
			);
			throw new Error(`Failed to get info file ${url.href}`);
		}
		const { result: info } = await response.json();
		console.debug(`${logPrefix} Received`);
		return info;
	}
	async destroy(cred) {
		const url = this.fileURL(cred.fileId);
		const logPrefix = `[file-service:${url.href}]`;
		console.debug(`${logPrefix} Destroying`);
		const response = await (0, node_fetch_1.default)(url, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this.createToken(enum_1.Token.User, { userId: cred.userId }),
			},
		});
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to destroy. Status:`,
				response.status,
				'Response:',
				await response.text(),
			);
			throw new Error(`Failed to destroy file ${url.href}`);
		}
		console.debug(`${logPrefix} Destroyed`);
		return true;
	}
}
exports.FileServiceHandler = FileServiceHandler;
//# sourceMappingURL=handler.js.map
