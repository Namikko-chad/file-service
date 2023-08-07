import { DataSource, DeepPartial, ObjectLiteral, Repository, } from 'typeorm';

export abstract class AbstractGenerator<Entity extends ObjectLiteral> {
  protected readonly _repository: Repository<Entity>;
  
  constructor(protected readonly _ds: DataSource) {
    this._repository = this._ds.getRepository(this.constructor.name.replace('EntityGenerator', ''));
  }

  protected abstract default(): DeepPartial<Entity>

  async create(params?: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.default();
    if (params)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, security/detect-object-injection
      Object.entries(params).forEach( ([key, value]) => entity[key] = value );

    return this.save(entity);
  }

  async save(entity: DeepPartial<Entity>): Promise<Entity> {
    return this._repository.save(entity);
  }
}