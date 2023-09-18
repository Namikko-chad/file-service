import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean, IsPositive, IsString, IsUUID, } from 'class-validator';

export interface FileInfo {
  id: string;
  name: string;
  ext: string;
  mime: string;
  size: number;
  public: boolean;
  userId: string;
  hash: string;
}

export class FileInfoDto implements FileInfo {
  @ApiProperty({})
  @IsUUID()
    id: string;

  @ApiProperty({})
  @IsString()
    name: string;

  @ApiProperty({})
  @IsString()
    ext: string;

  @ApiProperty({})
  @IsString()
    mime: string;

  @ApiProperty({})
  @IsPositive()
    size: number;

  @ApiProperty({})
  @IsBoolean()
    public: boolean;

  @ApiProperty({})
  @IsUUID()
    userId: string;

  @ApiProperty({})
  @IsString()
    hash: string;
}
