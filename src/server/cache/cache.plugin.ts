import { Plugin, Server, } from '@hapi/hapi';

import { CacheService, } from './cache.service';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    cache: CacheService;
  }
}

export const CachePlugin: Plugin<unknown> = {
  name: 'cache',
  dependencies: 'redis',
  register: (server: Server) => {
    server.app.cache = new CacheService(server.app.redis);
  },
};
