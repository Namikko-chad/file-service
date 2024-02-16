import { config as dotenv, } from 'dotenv';
import { Redis, } from 'ioredis';

import { describe, expect, it, } from '@jest/globals';

import { CacheService, } from './cache.service';

dotenv();

describe('Cache', () => {
  const redis = new Redis();
  const service = new CacheService(redis);

  it('should save data', async () => {
    const res = await service.save('test', 'test');
    expect(res).toBe('OK');
  });

  it('should find data', () => {
    const res = service.exist('test');
    expect(res).toBe(true);
  });

});