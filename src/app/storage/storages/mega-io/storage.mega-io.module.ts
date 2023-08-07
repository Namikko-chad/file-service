import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { MegaIOConfig, } from './storage.mega-io.config';
import { MegaIOStorage, } from './storage.mega-io.service';

@Module({
  imports: [],
  providers: [
    ConfigService,
    MegaIOConfig,
    MegaIOStorage
  ],
  exports: [MegaIOStorage],
})
export class MegaIOModule {}
