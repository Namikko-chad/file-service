import FormData from 'form-data';
import { JwtPayload, sign, verify, } from 'jsonwebtoken';
import fetch from 'node-fetch';
import { URL, } from 'url';
import { Token, } from './enum';
import { FileCred, FileInfo, FileServiceOptions, FileUpload, FileEdit, } from './interfaces';

interface UserAuthData {
	readonly userId?: string;
	readonly timestamp: number;
}

interface FileServicePOSTResponse {
	ok: true;
	result: FileInfo;
}

export class FileServiceHandler {
	private readonly apiUrl: URL;
	private readonly adminAccess: Required<FileServiceOptions['adminAccess']>;
	private readonly userAccess: Required<FileServiceOptions['userAccess']>;
	private readonly fileAccess: Required<FileServiceOptions['fileAccess']>;

	constructor(_options: FileServiceOptions) {
		const { apiUrl, fileAccess, userAccess, adminAccess, } = _options;

		this.apiUrl = new URL(apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`);

		const { expired: fileAccessExpiresIn = 900000, } = fileAccess;

		this.fileAccess = {
			...fileAccess,
			expired: fileAccessExpiresIn,
		};

		const { expired: userAccessExpiresIn = 60 * 60 * 24 * 3 * 1000, /* 3 days */ } = userAccess;

		this.userAccess = {
			...userAccess,
			expired: userAccessExpiresIn,
		};

		const { expired: adminAccessExpiresIn = 60 * 60 * 24 * 3 * 1000, /* 3 days */ } = adminAccess;

		this.adminAccess = {
			...adminAccess,
			expired: adminAccessExpiresIn,
		};
	}

	fileURL(fileId: string, route?: 'info'): URL {
		let path = `files/${fileId}`;

		if (route) {
			path += `/${route}`;
		}

		return new URL(path, this.apiUrl);
	}

	getDirectLink(_cred: FileCred): URL {
		const url = this.fileURL(_cred.fileId);

		url.searchParams.set('access_token', this.createToken(Token.File, _cred));

		return url;
	}

	private filePostBody(_file: FileUpload): FormData {
		const body = new FormData();

		if (_file.public) {
			body.append('public', String(_file.public));
		}
		body.append('file', _file.data, {
			filename: _file.name,
			contentType: _file.mime,
		});
		return body;
	}

	public createToken(_tokenType: Token, _cred: Partial<FileCred>): string {
		const data: UserAuthData = {
			..._cred,
			timestamp: Date.now(),
		};
		let secret: string;
		let expiresIn: number;
		switch (_tokenType) {
		case Token.File:
			secret = this.fileAccess.secret;
			expiresIn = this.fileAccess.expired;
			break;
		case Token.User:
			secret = this.userAccess.secret;
			expiresIn = this.userAccess.expired;
			break;
		case Token.Admin:
			secret = this.adminAccess.secret;
			expiresIn = this.adminAccess.expired;
			break;
		}

		return sign(data, secret, { expiresIn, });
	}

	public validateToken(_tokenType: Token, _token: string): string | JwtPayload {
		let secret: string;
		switch (_tokenType) {
		case Token.File:
			secret = this.fileAccess.secret;
			break;
		case Token.User:
			secret = this.userAccess.secret;
			break;
		case Token.Admin:
			secret = this.adminAccess.secret;
			break;
		}
		try {
			return verify(_token, secret);
		} catch (e) {
			throw Error('Token invalid');
		}
	}

	async create(file: FileUpload): Promise<FileInfo> {
		const url = new URL('files', this.apiUrl);
		const { ...info } = file;
		const logPrefix = `[file-service:${url.href}]`;

		console.debug(`${logPrefix} Creating`, info);
		const response = await fetch(url, {
			method: 'POST',
			body: this.filePostBody(file),
			headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: info.userId, }), },
		});

		const responseText = await response.text();

		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to create`,
				info,
				'Status:',
				response.status,
				'Response:',
				responseText
			);
			throw new Error(`Failed to create ${file.name} for ${file.userId}`);
		}

		const { result, } = JSON.parse(responseText) as { ok: true; result: FileInfo };

		console.debug(`${logPrefix} Created`, responseText);

		return result;
	}

	async edit(file: FileEdit): Promise<FileInfo> {
		const url = this.fileURL(file.fileId);
		const { ...info } = file;
		const logPrefix = `[file-service:${url.href}]`;

		console.debug(`${logPrefix} Editing`, info);

		const response = await fetch(url, {
			method: 'PUT',
			body: this.filePostBody(file),
			headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: info.userId, }), },
		});

		const responseText = await response.text();

		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to edit`,
				info,
				'Status:',
				response.status,
				'Response:',
				responseText
			);
			throw new Error(`Failed to edit ${file.name} for ${file.userId}`);
		}

		const { result, } = JSON.parse(responseText) as FileServicePOSTResponse;

		console.debug(`${logPrefix} Edited`, responseText);

		return result;
	}

	async get(cred: FileCred): Promise<Buffer> {
		const url = this.fileURL(cred.fileId);
		const logPrefix = `[file-service:${url.href}]`;

		console.debug(`${logPrefix} Downloading`);

		const response = await fetch(url, {
			headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), },
		});
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to download. Status:`,
				response.status,
				'Response:',
				await response.text()
			);
			throw new Error(`Failed to download file ${url.href}`);
		}

		const buffer = await response.buffer();

		console.debug(`${logPrefix} Downloaded`, buffer.length, 'bytes');

		return buffer;
	}

	async info(cred: FileCred): Promise<FileInfo> {
		const url = this.fileURL(cred.fileId, 'info');
		const logPrefix = `[file-service:${url.href}]`;

		console.debug(`${logPrefix} Get info`);

		const response = await fetch(url, {
			headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), },
		});

		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to get info. Status:`,
				response.status,
				'Response:',
				await response.text()
			);
			throw new Error(`Failed to get info file ${url.href}`);
		}

		const { result: info, } = (await response.json()) as { result: FileInfo };

		console.debug(`${logPrefix} Received`);

		return info;
	}

	async destroy(cred: FileCred): Promise<boolean> {
		const url = this.fileURL(cred.fileId);
		const logPrefix = `[file-service:${url.href}]`;

		console.debug(`${logPrefix} Destroying`);

		const response = await fetch(url, {
			method: 'DELETE',
			headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), },
		});
		if (!response.ok) {
			console.error(
				`${logPrefix} Failed to destroy. Status:`,
				response.status,
				'Response:',
				await response.text()
			);
			throw new Error(`Failed to destroy file ${url.href}`);
		}

		console.debug(`${logPrefix} Destroyed`);

		return true;
	}
}
