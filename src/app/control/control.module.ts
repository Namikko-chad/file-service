import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { File, FileRepository, } from '../files';
import { StorageModule, } from '../storage';
import { ControlController, } from './control.controller';
import { ControlService, } from './control.service';

@Module({
  imports: [TypeOrmModule.forFeature([File]), StorageModule],
  controllers: [ControlController],
  providers: [ControlService, FileRepository],
  exports: [ControlService],
})
export class ControlModule {}
