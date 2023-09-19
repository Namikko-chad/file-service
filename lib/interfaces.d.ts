/// <reference types="node" />
/// <reference types="node" />
import { Token } from 'enum';
export interface FileInfo {
    readonly id: string;
    readonly name: string;
    readonly ext: string;
    readonly mime: string;
    readonly size: number;
    readonly public: boolean;
    readonly userId: string;
    readonly hash: string;
}
export interface FileUpload {
    readonly userId: string;
    readonly name: string;
    readonly mime: string;
    readonly data: Buffer;
    readonly public?: boolean | undefined;
}
export interface FileEdit {
    readonly name: string;
    readonly public?: boolean | undefined;
}
export interface FileCred {
    readonly fileId: string;
    readonly userId: string;
}
export interface JwtPayload {
    userId: string;
    fileId: string;
}
export interface FileServiceConfig {
    readonly apiUrl: URL;
    readonly [Token.File]: {
        readonly expired?: number | undefined;
        readonly secret: string;
    };
    readonly [Token.User]: {
        readonly expired?: number | undefined;
        readonly secret: string;
    };
    readonly [Token.Admin]: {
        readonly expired?: number | undefined;
        readonly secret: string;
    };
}
//# sourceMappingURL=interfaces.d.ts.map