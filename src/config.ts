import { config, } from 'dotenv';
import { FileServiceOptions, } from './interfaces';

let fileServiceConfig: FileServiceOptions | undefined;

export function loadFileServiceConfig(): FileServiceOptions {
	if (!fileServiceConfig) {
		config();
		fileServiceConfig = {
			apiUrl: process.env.FILE_SERVICE_URL as string,
			fileAccess: {
				secret: process.env.FA_SECRET as string,
				expired: Number(process.env.FA_LIFETIME) || undefined,
			},
			userAccess: {
				secret: process.env.UA_SECRET as string,
				expired: Number(process.env.UA_LIFETIME) || undefined,
			},
			adminAccess: {
				secret: process.env.AA_SECRET as string,
				expired: Number(process.env.AA_LIFETIME) || undefined,
			},
		};
	}

	return fileServiceConfig;
}
