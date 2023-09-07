import * as jwt from 'jsonwebtoken';

import { Boom, } from '@hapi/boom';
import { AuthArtifacts, AuthCredentials, Request, } from '@hapi/hapi';

import { config, } from '../config/config';
import { error, } from '../utils';
import { Strategies, Token, } from './auth.enum';
import { AuthErrors, AuthErrorsMessages, } from './auth.errors';

export interface IJwtData {
  userId: string;
  fileId?: string;
  timestamp: number;
}

export function decodeJwt(token: string, secret: string): IJwtData {
  return jwt.verify(token, secret) as IJwtData;
}

interface TokenValidateSuccess {
  isValid: boolean;
  credentials: AuthCredentials;
  artifacts: AuthArtifacts;
}

export function tokenValidate(r: Request, token: string): TokenValidateSuccess | Boom {
  function tryDecode(token: string): [IJwtData, Token] {
    let data: IJwtData;
    let tokenType: Token;
    Object.values(Token)
      .map((tokenType) => {
        return {
          tokenType,
          // eslint-disable-next-line security/detect-object-injection
          secret: (config.auth.jwt[tokenType] as { secret: string }).secret,
        };
      })
      .some((secret) => {
        tokenType = secret.tokenType;

        try {
          data = decodeJwt(token, secret.secret);

          return true;
        } catch (err) {
          const e = err as Error;
          if (e.name === 'TokenExpiredError') throw error(AuthErrors.TokenExpired, AuthErrorsMessages[AuthErrors.TokenExpired], {});
        }

        return false;
      });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!data || !tokenType) throw error(AuthErrors.TokenInvalid, AuthErrorsMessages[AuthErrors.TokenInvalid], {});

    return [data, tokenType];
  }

  const [data, tokenType] = tryDecode(token);

  switch (tokenType) {
    case Token.File:
      if (!r.route.settings.auth?.strategies.includes(tokenType === Token.File ? Strategies.Query : Strategies.Header))
        throw error(AuthErrors.TokenInvalid, AuthErrorsMessages[AuthErrors.TokenInvalid], {});
      break;
  }

  return {
    isValid: true,
    credentials: { user: { id: data.userId, }, fileId: data?.fileId, },
    artifacts: { token, tokenType, },
  };
}
