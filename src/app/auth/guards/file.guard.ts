import { Injectable, } from '@nestjs/common';
import { Reflector, } from '@nestjs/core';
import { Request, } from 'express';

import { AuthConfig, } from '../auth.config';
import { AbstractGuard, } from './abstract.guard';

@Injectable()
export class FileAccessGuard extends AbstractGuard {
  secretKey: string;
  extractor: (request: Request) => string | undefined;

  constructor(reflector: Reflector, options: AuthConfig) {
    super(reflector);
    this.secretKey = options.jwt.file.secret;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.extractor = AbstractGuard.extractTokenFromQuery;
  }
}
