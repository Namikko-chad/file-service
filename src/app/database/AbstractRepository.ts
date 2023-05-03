import { DeepPartial, FindOptionsWhere, Repository, } from 'typeorm';

export abstract class AbstractRepository<Entity> extends Repository<Entity> {
  async reload(entity: Entity & { id: string }): Promise<Entity> {
    return this.findOneBy({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id: entity.id,
    });
  }

  async findOrCreate(param: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[], property: DeepPartial<Entity>): Promise<Entity> {
    let findRes = (await this.findOneBy(param)) as Entity;

    if (!findRes) {
      const newEntity = this.create(property);
      await this.save(newEntity);
      findRes = newEntity;
    }

    return findRes;
  }
}
