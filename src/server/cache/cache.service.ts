import { Redis, } from 'ioredis';

export type CachePayload = string | number | Buffer;

export class CacheService {

  constructor(private readonly redis: Redis) {
    
  }

  async exist(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  async load(key: string): Promise<string> {
    const data = await this.redis.get(key);
    if (!data)
      throw new Error('Data not found');

    return data;
  }

  async loadBuffer(key: string): Promise<Buffer> {
    const data = await this.redis.getBuffer(key);
    if (!data)
      throw new Error('Data not found');

    return data;
  }

  async save(key: string, value: CachePayload) {
    return this.redis.set(key, value);
  }
}