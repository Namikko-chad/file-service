import Joi from 'joi';

import { ServerRoute, } from '@hapi/hapi';

import { checkAdmin, } from '../helper/checkAdmin';
import * as api from './control.api';

export default <ServerRoute[]>[
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
          // FIXME
            .valid(...['db', 'folder', 'megaio', 'googledrive'])
            .required(),
        }),
      },
    },
  }
];
