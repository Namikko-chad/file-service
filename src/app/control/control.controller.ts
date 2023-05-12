import { Controller, Delete, Get, HttpStatus, Param, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';

import { Exception, } from '../utils/Exception';
import { ControlService, } from './control.service';

class ParamsDTO {
  reportType?: string;
  storage?: string;
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

  @Delete('storage/:storage/flush')
  @ApiOperation({
    summary: 'Use this endpoint to flush storage',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
  tokenValidate(@Param() params: ParamsDTO): void {
    console.log(params);
    throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented');
  }
}
