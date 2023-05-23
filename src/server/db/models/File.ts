import { Column, DataType, HasMany,Scopes, Table, } from 'sequelize-typescript';

import { StorageType, } from '../../storages';
import { AbstractModel, } from './abstract/AbstractModel';
import { FileUser, } from './FileUsers';

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
    ext!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    mime!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
    size!: number;

  @Column({
    type: DataType.STRING,
    defaultValue: StorageType.DB,
  })
    storage!: StorageType;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
    hash!: string;

  @HasMany(() => FileUser)
    fileUsers?: FileUser[];
}
