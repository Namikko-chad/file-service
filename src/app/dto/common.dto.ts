import { Request, } from 'express';
import { AbstractGuard, } from 'app/auth/guards/abstract.guard';

export interface RequestAuth extends Request {
  artifacts: {
    guard: AbstractGuard
  };
  user?: {
    id: string
  };
  fileId?: string;
}