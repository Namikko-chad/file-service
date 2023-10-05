import { ApiProperty, } from '@nestjs/swagger';
import { Expose, plainToInstance, } from 'class-transformer';
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
  static create(this: void, input: FileInfoDto): FileInfoDto {
    return plainToInstance(FileInfoDto, input, { strategy: 'excludeAll', });
  }

  @ApiProperty({ description: 'Unique identifier of user file', format: 'uuid', })
  @Expose()
  @IsUUID()
    id: string;

  @ApiProperty({ description: 'Name of user file', format: 'string', })
  @Expose()
  @IsString()
    name: string;

  @ApiProperty({ description: 'Extension of user file', format: 'string', })
  @Expose()
  @IsString()
    ext: string;

  @ApiProperty({ description: 'Mime type of user file', format: 'string', })
  @Expose()
  @IsString()
    mime: string;

  @ApiProperty({ description: 'File size in bytes', format: 'number', })
  @Expose()
  @IsPositive()
    size: number;

  @ApiProperty({ description: 'Visibility', format: 'boolean', })
  @Expose()
  @IsBoolean()
    public: boolean;

  @ApiProperty({ description: 'Unique identifier of user', format: 'uuid', })
  @Expose()
  @IsUUID()
    userId: string;

  @ApiProperty({ description: 'Hash of user file', format: 'string', })
  @Expose()
  @IsString()
    hash: string;
}
