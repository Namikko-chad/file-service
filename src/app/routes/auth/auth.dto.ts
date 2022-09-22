import { ApiProperty, } from '@nestjs/swagger';
import { IsEmail, MaxLength, } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  	email: string;

  @ApiProperty()
  @MaxLength(128)
  	password: string;
}
