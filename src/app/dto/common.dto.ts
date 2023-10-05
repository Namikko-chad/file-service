import { Type, } from '@nestjs/common';
import { ApiProperty, } from '@nestjs/swagger';
import { Request, } from 'express';

import { AbstractGuard, } from '../auth/guards/abstract.guard';

export interface RequestAuth extends Request {
  artifacts: {
    guard: AbstractGuard;
  };
  user: {
    id: string;
  };
  fileId?: string;
}

export class OutputEmptyDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Whether the operation was successful',
  })
    ok: boolean;
}

export function outputOkDtoGenerator<Response>(propertyType: Type<Response>): Type<unknown> {
  class OutputOkDto {
    @ApiProperty({
      type: 'boolean',
      description: 'Whether the operation was successful',
    })
      ok: boolean;
    
    @ApiProperty({
      type: () => propertyType,
    })
      result: Response;
  }

  return OutputOkDto;
}

export function outputPaginationDtoGenerator<Response>(propertyType: Type<Response>): Type<unknown> {
  class PaginationResultDto<Response> {
    @ApiProperty({
      description: 'Number of results',
    })
      count: number;
  
    @ApiProperty({
      description: 'Array of results',
      isArray: true,
      type: () => propertyType,
    })
      rows: Response[];
  }

  class OutputPaginationDto<Response> {
    @ApiProperty({
      type: 'boolean',
      description: 'Whether the operation was successful',
    })
      ok: boolean;
  
    @ApiProperty({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      type: () => PaginationResultDto<Response>,
      description: 'Pagination result',
    })
      result: PaginationResultDto<Response>;
  }

  return OutputPaginationDto;
}
