import { FindOptionsWhere, Repository, } from 'typeorm';

import File from '../entity/file.entity';

export default class FileRepository extends Repository<File> {
	async findByPk(
		options?: FindOptionsWhere<File>
	): Promise<File> {
		const data = await this.findOneBy(options);

		return data;
	}
}
