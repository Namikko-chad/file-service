import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean, IsPositive, IsString, IsUUID, } from 'class-validator';

export class FileInfoDto {
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
