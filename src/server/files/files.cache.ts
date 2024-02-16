// import { Redis, } from 'ioredis';
// import { config as dotenv, } from 'dotenv';
// import { Server } from '@hapi/hapi';
// import { Storage } from '../storages';

// dotenv();

// type AccessCount = Map<string, Array<Date>>;

// interface config {
//   countToCache: number;
//   fileSizeLimit: number;
// }

// export class FileCache {
//   private readonly config: config;
//   private readonly cache: Redis;
//   private readonly storage: Storage;
  
//   constructor(server: Server) {
//     this.config = {
//       countToCache: 10,
//       fileSizeLimit: 10 * 1024 * 1024,
//     }
//   }

//   async checkCount(fileId: string): Promise<void> {
//     const serialized = await this.cache.get(`access_${fileId}`);

//     if (!serialized) {
//       return;
//     }

//     const log = JSON.parse(serialized) as AccessCount;

//     if (log.size > 10) {
//       await this.cache.del(`access_${fileId}`);
//     }
//   }
//   }
// }