/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { FileServiceConfig } from './interfaces';
export declare class FileServiceConnectorConfig implements FileServiceConfig {
    private readonly _config;
    readonly apiUrl: URL;
    readonly file: {
        readonly expired: number;
        readonly secret: string;
    };
    readonly user: {
        readonly expired: number;
        readonly secret: string;
    };
    readonly admin: {
        readonly expired: number;
        readonly secret: string;
    };
    constructor(_config: ConfigService);
}
//# sourceMappingURL=config.d.ts.map