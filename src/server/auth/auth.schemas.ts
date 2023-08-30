import Joi from 'joi';

import { Token, } from './auth.enum';

export const tokenTypeSchema = Joi.object({
  tokenType: Joi.string()
    .valid(...Object.values(Token))
    .default(Token.User)
    .example(Token.User),
}).label('Token Type');