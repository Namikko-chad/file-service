import crypto from 'crypto';
import { DeepPartial, } from 'typeorm';

import { AbstractGenerator, } from 'app/database';
import { Utils, } from 'app/utils';

import { File, } from '../entity';

export class FileEntityGenerator extends AbstractGenerator<File> {
  protected override default(): DeepPartial<File> {
    const buffer = Buffer.from('test text');
    const file = new File();
    file.id = Utils.getUUID();
    file.ext = 'txt';
    file.mime = 'text/plain';
    file.createdAt = new Date();
    file.updatedAt = new Date();
    file.hash = crypto.createHash('md5').update(buffer).digest('hex');
    file.size = buffer.length;
    file.storage = 'folder';

    return file;
  }
}