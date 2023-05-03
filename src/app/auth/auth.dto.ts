import { ApiProperty, } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, } from 'class-validator';

export enum Token {
  File = 'file',
  User = 'user',
  Admin = 'admin',
}

export class AuthParamsDTO {
  @ApiProperty({
    required: true,
    enum: Token,
  })
  @IsEnum(Token)
    tokenType!: Token;
}

export class AuthBodyDTO {
  @ApiProperty({
    required: false,
  })
  @IsString()
    userId!: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
    fileId?: string;
}
