import { ApiProperty, } from '@nestjs/swagger';
import { IsUUID, } from 'class-validator';

export class FileIdDto {
  @ApiProperty({ description: 'Unique identifier of user file', format: 'uuid', })
  @IsUUID()
    fileId!: string;
}