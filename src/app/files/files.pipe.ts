import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { FileConfig, } from './files.config';

@Injectable()
export class FilePipe implements PipeTransform<Express.Multer.File, Express.Multer.File> {

  constructor(@Inject(FileConfig) private readonly config: FileConfig) {}

  transform(value: Express.Multer.File, _: ArgumentMetadata): Express.Multer.File {
    if (value.size > this.config.maxSize)
      throw new PayloadTooLargeException({ message: `File size too large, max: ${this.config.maxSize}`, });

    if (!this.config.allowedExtensionsRegExp.test(value.mimetype))
      throw new UnsupportedMediaTypeException({ message: `${value.mimetype} is not supported`, });

    return value;
  }
}
