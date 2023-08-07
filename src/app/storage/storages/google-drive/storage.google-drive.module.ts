import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { JwtService, } from '@nestjs/jwt';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { GoogleDriveConfig, } from './storage.google-drive.config';
import { GoogleDrive, } from './storage.google-drive.entity';
import { GoogleDriveRepository, } from './storage.google-drive.repository';
import { GoogleDriveStorage, } from './storage.google-drive.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleDrive])],
  providers: [
    ConfigService,
    JwtService,
    GoogleDriveConfig,
    GoogleDriveRepository,
    GoogleDriveStorage
  ],
  exports: [GoogleDriveStorage],
})
export class GoogleDriveModule {}
