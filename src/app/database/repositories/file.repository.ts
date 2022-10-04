import { Repository, } from 'typeorm';

import File from '../entity/file.entity';

export default class FileRepository extends Repository<File> {
}
