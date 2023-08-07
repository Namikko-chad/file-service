import { ApiProperty, } from '@nestjs/swagger';
import { IsString, } from 'class-validator';

export class ControlFlushStorageDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
    storageType: string;

}