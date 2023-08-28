import { DeepPartial, DeleteResult, FindOptionsWhere, ObjectID, QueryRunner, Repository, } from 'typeorm';

import { AbstractEntity, } from './AbstractEntity';

export interface Options {
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

export abstract class AbstractRepository<Entity extends AbstractEntity | object> extends Repository<Entity> {
  async reload(entity: Entity): Promise<Entity> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.findOneBy({ id: entity.id, });
  }

  async findOrCreate(
    param: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[], 
    property: DeepPartial<Entity>,
    options?: Options
  ): Promise<[Entity, boolean]> {
    let findRes: Entity;
    let newEntity: Entity;

    if (options?.queryRunner) {
      findRes = await options.queryRunner.manager.findOneBy(this.metadata.tableName, param);

      if (!findRes) {
        newEntity = this.create(property);
        await options.queryRunner.manager.save(newEntity);
      }
    } else {
      findRes = (await this.findOneBy(param));

      if (!findRes) {
        newEntity = this.create(property);
        await this.save(newEntity);
      }
    }

    return [newEntity ?? findRes, !findRes];
  }

  override async delete(
    criteria: conditions<Entity>,
    options?: Options
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
