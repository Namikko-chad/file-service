import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, } from '@nestjs/common';
import { plainToInstance, } from 'class-transformer';
import { validate, } from 'class-validator';

@Injectable()
export class AppValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    const obj = plainToInstance<object, unknown>(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property}: ${Object.values(err.constraints).join(', ')}`;
      });

      throw new HttpException(messages.join(', '), HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
