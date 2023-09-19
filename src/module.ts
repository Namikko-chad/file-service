import { Module, } from '@nestjs/common';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { JwtModule, } from '@nestjs/jwt';

import { FileServiceConnectorConfig, } from './config';
import { FileServiceConnectorService, } from './service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule
  ],
  providers: [
    ConfigService,
    FileServiceConnectorConfig,
    FileServiceConnectorService
  ],
  exports: [
    FileServiceConnectorService
  ],
})
export class FileServiceConnectorModule {}