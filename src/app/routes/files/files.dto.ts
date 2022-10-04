import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, MaxLength, } from 'class-validator';

export class FileListDto {
  @ApiProperty({
  	required: false,
  	default: 10,
  })
  @IsInt()
  	limit: number;

  @ApiProperty({
  	required: false,
  	default: 0,
  })
  @IsInt()
  	offset: number;

  @ApiProperty({
  	required: false,
  })
  @IsString()
  	search: string;

  @ApiProperty({
  	required: false,
  })
  @IsString()
  	order: string;

  @ApiProperty({
  	required: false,
  })
  @IsInt()
  	from: number;
  
  @ApiProperty({
  	required: false,
  })
  @IsInt()
  	to: number;
}

export class FileRetrieveDto {
  @ApiProperty({
  	required: false,
  })
  @IsString()
  	token: string;
}

export class FileEditDto {
  @ApiProperty()
  @IsBoolean()
  	public: boolean;

  @ApiProperty()
  @MaxLength(128)
  	name: string;
}
