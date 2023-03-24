import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean, IsString, } from 'class-validator';

export class FileEditDto {
	@ApiProperty({
		required: false,
		default: false,
		example: false,
	})
	@IsBoolean()
		public: boolean;

  @ApiProperty({
  	required: false,
  	example: 'photo.jpg',
  })
  @IsString()
  	name: string;
}