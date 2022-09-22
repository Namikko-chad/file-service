import { FindOneOptions, Repository, } from 'typeorm';

import File from '../entity/file.entity';

export default class FileRepository extends Repository<File> {
	async findByEmail(
		options?: FindOneOptions<File>
	): Promise<File> {
		const data = await this.findOne(options);

		return data;
	}
}
