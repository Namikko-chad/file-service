import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean,  MaxLength, } from 'class-validator';

export class FileEditDto {
	@ApiProperty()
	@IsBoolean()
		public: boolean;

	@ApiProperty()
	@MaxLength(128)
		name: string;
}