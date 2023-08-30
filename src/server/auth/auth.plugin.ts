import { Plugin, Server, } from '@hapi/hapi';

import { Strategies, Token, } from './auth.enum';
import routes from './auth.routes';
import { tokenValidate, } from './auth.utils';

declare module '@hapi/hapi' {
  interface UserCredentials {
    id: string;
  }
  interface AuthCredentials {
    fileId: string | undefined;
  }
  interface AuthArtifacts {
    token: string;
    tokenType: Token;
  }
}

export const AuthPlugin: Plugin<unknown> = {
  name: 'auth',
  register: (server: Server) => {

    // JWT Auth
    server.auth.strategy(Strategies.Header, 'bearer-access-token', {
      validate: tokenValidate,
    });
    server.auth.strategy(Strategies.Query, 'bearer-access-token', {
      allowQueryToken: true,
      validate: tokenValidate,
    });
    server.auth.default(Strategies.Header);
    server.route(routes);
  },
};
