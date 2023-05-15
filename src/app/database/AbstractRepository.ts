import { DeepPartial, DeleteResult, FindOptionsWhere, ObjectID, QueryRunner, Repository, } from 'typeorm';

export interface DeleteOptions {
  queryRunner?: QueryRunner;
}

type conditions<Entity> =
  | string
  | string[]
  | number
  | number[]
  | Date
  | Date[]
  | ObjectID
  | ObjectID[]
  | FindOptionsWhere<Entity>;

export abstract class AbstractRepository<Entity> extends Repository<Entity> {
  async reload(entity: Entity & { id: string }): Promise<Entity> {
    return this.findOneBy({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id: entity.id,
    });
  }

  async findOrCreate(param: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[], property: DeepPartial<Entity>): Promise<[Entity, boolean]> {
    const findRes = (await this.findOneBy(param)) as Entity;
    let newEntity: Entity;

    if (!findRes) {
      newEntity = this.create(property);
      await this.save(newEntity);
    }

    return [newEntity ?? findRes, !!findRes];
  }

  override async delete(
    criteria: conditions<Entity>,
    options?: DeleteOptions
  ): Promise<DeleteResult> {
    let data: DeleteResult;

    if (options?.queryRunner) {
      data = await options.queryRunner.manager.delete(
        this.metadata.target,
        criteria
      );
    } else {
      data = await super.delete(criteria);
    }

    return data;
  }
}
