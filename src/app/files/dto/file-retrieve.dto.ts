import { ApiProperty, } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';

export class FileRetrieveDto {
  @ApiProperty({
    required: false,
    description: 'Authentication token',
  })
  @IsOptional()
  @IsString()
    token: string;
}
