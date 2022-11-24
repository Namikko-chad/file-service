import { Global, Module, } from '@nestjs/common';
import FilesModule from './files/files.module';

@Global()
@Module({
	controllers: [FilesModule],
})
export default class RoutesModule {}
