import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { File, } from 'app/files/entity';
import { FileRepository, } from 'app/files/repositories';
import { StorageModule, } from 'app/storage/storage.module';

import { ControlController, } from './control.controller';
import { ControlService, } from './control.service';

@Module({
  imports: [TypeOrmModule.forFeature([File]), StorageModule],
  controllers: [ControlController],
  providers: [ControlService, FileRepository],
  exports: [ControlService],
})
export class ControlModule {}
