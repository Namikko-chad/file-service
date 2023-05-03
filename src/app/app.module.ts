import { Module, } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';

import { AuthModule, } from './auth/auth.module';
import { ControlModule, } from './control/control.module';
import { DatabaseModule, } from './database/database.module';
import { FileModule, } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    FileModule,
    ControlModule
  ],
})
export class AppModule {}
