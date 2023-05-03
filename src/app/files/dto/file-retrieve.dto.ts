import { ApiProperty, } from '@nestjs/swagger';
import { IsString, } from 'class-validator';

export class FileRetrieveDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
    token: string;
}
