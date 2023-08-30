import { ModelCtor, Sequelize, } from 'sequelize-typescript';

import { AbstractModel, } from './AbstractModel';

export abstract class AbstractGenerator<Model extends AbstractModel> {

  constructor(db: Sequelize, model: ModelCtor | ModelCtor[]) {
    db.addModels(Array.isArray(model) ? model : [model]);
  }
  
  protected abstract default(): Model

  async create(params?: Partial<AbstractModel>): Promise<Model> {
    const model = this.default();
    if (params)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, security/detect-object-injection
      Object.entries(params).forEach( ([key, value]) => model[key] = value );

    return this.save(model);
  }

  async save(model: Model): Promise<Model> {
    return model.save();
  }
}