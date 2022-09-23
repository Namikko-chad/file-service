import { Inject, Injectable, } from '@nestjs/common';

import UserRepository from '../../database/repositories/file.repository';
import User from '../../database/entity/file.entity';

import { FileEditDto, } from './files.dto';

@Injectable()
export default class FilesService {
  @Inject(UserRepository)
	private readonly _repository: UserRepository;

  async create(_data: FileEditDto): Promise<User> {
  	const user = this._repository.create();
  	await this._repository.save(user);
  	return user;
  }
}
