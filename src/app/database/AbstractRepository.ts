import { Repository, } from 'typeorm';

export abstract class AbstractRepository<Entity> extends Repository<Entity> {
	async reload(entity: Entity & { id: string; }): Promise<Entity> {
		return this.findOneBy({
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			id: entity.id,
		})
	}
}
