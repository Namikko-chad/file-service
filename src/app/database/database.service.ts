/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, OnModuleInit, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { PrismaClient, } from '@prisma/client';

import { databaseConfig, } from './database.config';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  
  constructor(@Inject(ConfigService) config: ConfigService) {
    super(databaseConfig(config));
  }

  async onModuleInit() {
    await this.$connect();

  }
}