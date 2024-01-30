import { ApiProperty, } from '@nestjs/swagger';
import { Type, } from 'class-transformer';
import { IsDate, IsInt, IsObject, IsOptional, IsString, Min, Validate, ValidatorConstraint, ValidatorConstraintInterface, } from 'class-validator';

@ValidatorConstraint()
class OrderDirection implements ValidatorConstraintInterface {
  private accepted = ['ASC', 'DESC', 'asc', 'desc'];

  validate(req: Record<string, string>) {
    return !!!Object.values(req).filter((value) => !this.accepted.includes(value)).length;
  }

  defaultMessage(): string {
    return `order value must be ${this.accepted.join(', ')}`;
  }
}

export class ListDto {
  @ApiProperty({
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
    limit = 10;

  @ApiProperty({
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
    offset = 0;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
    search: string;

  @ApiProperty({
    required: false,
  })
  @IsObject()
  @IsOptional()
  @Validate(OrderDirection)
    order: Record<string, 'ASC' | 'DESC' | 'asc' | 'desc'>;

  @ApiProperty({
    required: false,
    type: Date,
    example: '2020-06-15T10:30:50.000Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
    from = new Date('0');

  @ApiProperty({
    required: false,
    type: Date,
    example: '2020-06-15T10:30:50.000Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
    to = new Date(new Date().setUTCHours(23, 59, 59, 999));
}
