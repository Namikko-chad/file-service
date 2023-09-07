import { Plugin, Server, } from '@hapi/hapi';

import { Storage, } from './storages.service';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    storage: Storage;
  }
}

export const StoragePlugin: Plugin<unknown> = {
  name: 'storage',
  dependencies: ['database'],
  register: async (server: Server) => {
    server.app.storage = new Storage();
    await server.app.storage.init(server.app.db);
  },
};
