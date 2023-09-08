import { BelongsTo,Column, DataType, ForeignKey, Scopes, Table, } from 'sequelize-typescript';

import { AbstractModel, } from '../../database/AbstractModel';
import { File, } from './File.model';

@Scopes(() => ({
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
}))
@Table({})
export class FileUser extends AbstractModel {
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare fileId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare public: boolean;

  @BelongsTo(() => File)
  declare file: File;
}
