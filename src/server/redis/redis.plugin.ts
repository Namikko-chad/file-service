import Redis, { RedisOptions, } from 'ioredis';

import { Plugin, Server, } from '@hapi/hapi';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    redis: Redis;
  }
}
export const RedisPlugin: Plugin<string | RedisOptions> = {
  name: 'redis',
  register(server: Server, config: string | RedisOptions) {
    let redis: Redis;
    if (typeof config === 'string') {
      redis = new Redis(config, { lazyConnect: true, });
    } else if (typeof config === 'object') {
      redis = new Redis(Object.assign(config, { lazyConnect: true, }));
    } else throw new Error('Invalid redis config');
    server.app.redis = redis;
  },
};
