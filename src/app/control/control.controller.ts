import { Controller, Delete, Get, HttpStatus, Param, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';

import { Exception, } from '../utils';
import { ControlFlushStorageDto, } from './control.dto';
import { ControlService, } from './control.service';

class ParamsDTO {
  reportType?: string;
}

@ApiTags('control')
@Controller('control')
export class ControlController {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(private readonly _service: ControlService) {}

  @Get('report/:reportType')
  @ApiOperation({
    summary: 'Use this endpoint to get report',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
  tokenInfo(@Param() params: ParamsDTO): unknown {
    console.log(params);
    throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented');
  }

  @Delete('storage/:storageType/flush')
  @ApiOperation({
    summary: 'Use this endpoint to flush storage',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
  async tokenValidate(@Param() params: ControlFlushStorageDto): Promise<void> {
    await this._service.flushStorage(params.storageType);
    throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented');
  }
}
