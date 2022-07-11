import { Plugin, Server, } from '@hapi/hapi';
import { Storage as IStorage, StorageOptions, } from './interface';
import { Storage, } from './Storage';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    storage: IStorage;
  }
}

export const StoragePlugin: Plugin<StorageOptions> = {
	name: 'storage',
	register: (server: Server, options?: StorageOptions) => {
		server.app.storage = Storage.init(options);
	},
};
