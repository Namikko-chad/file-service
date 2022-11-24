import { ApiProperty, } from '@nestjs/swagger';
import { IsInt, IsString, } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';

export class ListDto {
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
		order: FindOptionsOrder<any>;

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