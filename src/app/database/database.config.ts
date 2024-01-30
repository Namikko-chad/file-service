import { ConfigService, } from '@nestjs/config';
import { Prisma, } from '@prisma/client';

export function databaseConfig(configService: ConfigService): Prisma.PrismaClientOptions {
  const options: Prisma.PrismaClientOptions = {};
  if (configService.get<boolean>('DEBUG'))
    // options.log = ['query', 'info', 'warn', 'error'];
    options.log = [{
      emit: 'event',
      level: 'query',
    }];

  return options;
}
