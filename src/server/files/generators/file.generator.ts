import crypto from 'crypto';
import { Sequelize, } from 'sequelize-typescript';

import { AbstractGenerator, } from '../../database';
import { getUUID, } from '../../utils';
import { File, FileUser, } from '../models';

export class FileGenerator extends AbstractGenerator<File> {

  constructor(db: Sequelize) {
    super(db, [File, FileUser]);
  }

  protected override default(): File {
    const buffer = Buffer.from('test text');
    const file = new File();
    file.id = getUUID();
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