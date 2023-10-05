import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, } from 'class-validator';

export class FileEditDto {
  @ApiProperty({
    required: false,
    default: false,
    example: false,
    description: 'Visibility',
  })
  @IsOptional()
  @IsBoolean()
    public: boolean;

  @ApiProperty({
    required: false,
    example: 'photo.jpg',
    description: 'File name',
  })
  @IsOptional()
  @IsString()
    name: string;
}
