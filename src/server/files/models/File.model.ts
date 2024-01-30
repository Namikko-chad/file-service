import { Column, DataType, HasMany,Scopes, Table, } from 'sequelize-typescript';

import { AbstractModel, } from '../../database/AbstractModel';
import { FileUser, } from './FileUser.model';

@Scopes(() => ({
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
}))
@Table({})
export class File extends AbstractModel {
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare ext: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare mime: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare size: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare storage: string;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  declare hash: string;

  @HasMany(() => FileUser)
    fileUsers?: FileUser[];
}
