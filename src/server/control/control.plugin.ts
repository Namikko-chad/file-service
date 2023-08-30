import { Plugin, Server, } from '@hapi/hapi';

import routes from './control.routes';

export const ControlPlugin: Plugin<unknown> = {
  name: 'control',
  register: (server: Server) => {
    server.route(routes);
  },
};
