import * as HapiSwagger from 'hapi-swagger';

import { config, } from './config';

export const swaggerConfig = <HapiSwagger.RegisterOptions>{
  pathPrefixSize: 2,
  basePath: '/api/',
  host: `${config.server.host}:${config.server.port}`,
  grouping: 'tags',
  info: {
    title: 'File-service API Documentation',
    version: '1.0',
    description: 'File-service API Documentation',
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      'x-keyPrefix': 'Bearer ',
    },
  },
  security: [
    {
      Bearer: [],
    }
  ],
  jsonPath: '/documentation.json',
  documentationPath: '/documentation',
  debug: true,
};
