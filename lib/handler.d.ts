/// <reference types="node" />
import { JwtPayload } from 'jsonwebtoken';
import { URL } from 'url';
import { Token } from './enum';
import { FileCred, FileInfo, FileServiceOptions, FileUpload, FileEdit } from './interfaces';
export declare class FileServiceHandler {
	private readonly apiUrl;
	private readonly adminAccess;
	private readonly userAccess;
	private readonly fileAccess;
	constructor(_options: FileServiceOptions);
	fileURL(fileId: string, route?: 'info'): URL;
	getDirectLink(_cred: FileCred): URL;
	private filePostBody;
	createToken(_tokenType: Token, _cred: Partial<FileCred>): string;
	validateToken(_tokenType: Token, _token: string): string | JwtPayload;
	create(file: FileUpload): Promise<FileInfo>;
	edit(file: FileEdit): Promise<FileInfo>;
	get(cred: FileCred): Promise<Buffer>;
	info(cred: FileCred): Promise<FileInfo>;
	destroy(cred: FileCred): Promise<boolean>;
}
//# sourceMappingURL=handler.d.ts.map
