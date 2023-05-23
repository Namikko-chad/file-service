import Joi from 'joi';

import { ServerRoute, } from '@hapi/hapi';

import * as api from '../api/control';
import { checkAdmin, } from '../helper/checkAdmin';
import { StorageType, } from '../storages';

export default <ServerRoute[]>[
  {
    method: 'GET',
    path: '/control/report/{reportType}',
    handler: api.generateReport,
    options: {
      pre: [checkAdmin],
      id: 'control.report',
      description: 'Use this endpoint to get report',
      tags: ['api', 'control'],
      validate: {
        params: Joi.object({
          reportType: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/control/storage/{storage}/flush',
    handler: api.flushStorage,
    options: {
      pre: [checkAdmin],
      id: 'control.storage.flush',
      description: 'Use this endpoint to flush storage',
      tags: ['api', 'control'],
      validate: {
        params: Joi.object({
          storage: Joi.string()
            .valid(...Object.values(StorageType))
            .required(),
        }),
      },
    },
  }
];
