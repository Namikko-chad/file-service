import { ApiProperty, } from '@nestjs/swagger';
import { IsUUID, } from 'class-validator';


export class FileIdDto {
  @ApiProperty({})
  @IsUUID()
    fileId!: string;
}