import { Plugin, Server, } from '@hapi/hapi';

import routes from './files.routes';
import { File, } from './models/File.model';
import { FileUser, } from './models/FileUser.model';

export const FilesPlugin: Plugin<unknown> = {
  name: 'files',
  dependencies: ['database', 'storage', 'cache'],
  register: (server: Server) => {
    server.app.db.addModels([File, FileUser]);
    server.route(routes);
  },
};
