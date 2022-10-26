import { Plugin, Server, } from '@hapi/hapi';
import { StorageOptions, } from './interface';
import { Storage, } from './Storage';

declare module '@hapi/hapi' {
	export interface ServerApplicationState {
		storage: Storage;
	}
}

export const StoragePlugin: Plugin<StorageOptions> = {
	name: 'storage',
	register: (server: Server, options?: StorageOptions) => {
		server.app.storage = new Storage(options);
	},
};
