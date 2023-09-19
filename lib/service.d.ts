/// <reference types="node" />
/// <reference types="node" />
import { URL } from 'url';
import { Token } from './enum';
import { FileCred, FileEdit, FileInfo, FileUpload, JwtPayload } from './interfaces';
export declare class FileServiceConnectorService {
    private readonly logger;
    private readonly jwtService;
    private readonly config;
    fileURL(fileId: string, route?: 'info'): URL;
    getDirectLink(_cred: FileCred): URL;
    createToken(_tokenType: Token, _cred: Partial<FileCred>): string;
    validateToken(_tokenType: Token, _token: string): string | JwtPayload;
    create(file: FileUpload): Promise<FileInfo>;
    edit(cred: FileCred, file: FileEdit): Promise<void>;
    get(cred: FileCred): Promise<Buffer>;
    info(cred: FileCred): Promise<FileInfo>;
    destroy(cred: FileCred): Promise<boolean>;
}
//# sourceMappingURL=service.d.ts.map