import { URL, } from 'url';
import { JwtPayload, } from 'jsonwebtoken';
import { Token, } from './enum';

export interface FileInfo {
	readonly id: string;
	readonly userId: string;
	readonly name: string;
	readonly ext: string;
	readonly mime: string;
	readonly hash: string;
	readonly public: boolean;
}

export interface FileUpload {
	readonly userId: string;
	readonly name: string;
	readonly mime: string;
	readonly data: Buffer;
	readonly public?: boolean | undefined;
}

export interface FileEdit extends FileUpload {
	readonly fileId: string;
}

export interface FileCred {
	readonly fileId: string;
	readonly userId: string;
}

export interface FileServiceOptions {
	readonly apiUrl: string;
	readonly fileAccess: {
		readonly expired?: number | undefined;
		readonly secret: string;
	};
	readonly userAccess: {
		readonly expired?: number | undefined;
		readonly secret: string;
	};
	readonly adminAccess: {
		readonly expired?: number | undefined;
		readonly secret: string;
	};
}

export interface FileServiceServerAddons {
	fsCreateToken(tokenType: Token, credentials: Partial<FileCred>): string;
	fsValidateToken(tokenType: Token, token: string): string | JwtPayload;
	fsCreate(file: FileUpload): Promise<FileInfo>;
	fsEdit(file: FileEdit): Promise<FileInfo>;
	fsGet(cred: FileCred): Promise<Buffer>;
	fsGetDirectLink(cred: FileCred): URL;
	fsInfo(cred: FileCred): Promise<FileInfo>;
	fsDestroy(cred: FileCred): Promise<boolean>;
}
