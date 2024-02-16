import * as HapiBearer from 'hapi-auth-bearer-token';
import * as Pino from 'hapi-pino';
import * as HapiPulse from 'hapi-pulse';
import * as HapiSwagger from 'hapi-swagger';
import Qs from 'qs';

import * as Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';

import { AuthPlugin, } from './server/auth';
import { CachePlugin, } from './server/cache';
import { config, pinoConfig,swaggerConfig, } from './server/config';
import { ControlPlugin, } from './server/control';
import { Database, loadDatabaseConfig, } from './server/database';
import { FilesPlugin, } from './server/files';
import { RedisPlugin, } from './server/redis';
import { SchedulerPlugin, } from './server/scheduler';
import { StoragePlugin, } from './server/storages';
import { handleValidationError, responseHandler, } from './server/utils';

export async function init(): Promise<Hapi.Server> {
  const server = new Hapi.Server({
    port: config.server.port,
    host: config.server.host,
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      cors: config.cors,
      validate: {
        options: {
          // Handle all validation errors
          abortEarly: false,
        },
        failAction: handleValidationError,
      },
      response: {
        failAction: 'log',
      },
    },
  });
  server.realm.modifiers.route.prefix = '/api';
  
  await server.register([Inert, Vision, HapiBearer]);
  await server.register({
    plugin: Pino,
    options: pinoConfig(true),
  });
  await server.register({
    plugin: HapiSwagger,
    options: swaggerConfig,
  });
  await server.register({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    plugin: HapiPulse,
    options: {
      timeout: 15000,
      signals: ['SIGINT'],
    },
  });
  await server.register({
    plugin: Database,
    options: loadDatabaseConfig(),
  });
  await server.register({
    plugin: RedisPlugin,
  });
  await server.register({
    plugin: AuthPlugin,
  });
  await server.register({
    plugin: StoragePlugin,
  });
  await server.register({
    plugin: SchedulerPlugin,
  });
  await server.register({
    plugin: CachePlugin,
  });
  await server.register({
    plugin: FilesPlugin,
  });
  await server.register({
    plugin: ControlPlugin,
  });

  // Error handler
  server.ext('onPreResponse', responseHandler);
  
  // Запускаем сервер
  try {
    server.app.scheduler.init();
    await server.start();
    server.log('info', `Server running at: ${server.info.uri}`);
    server.log('info', 'Node.js version ' + process.versions.node);
  } catch (err) {
    server.log('error', JSON.stringify(err));
  }

  return server;
}

init().catch((error) => console.error(error));
