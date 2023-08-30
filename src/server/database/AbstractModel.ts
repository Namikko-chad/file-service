import { fn, } from 'sequelize';
import { Column, DataType, Model, } from 'sequelize-typescript';

export class AbstractModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: fn('uuid_generate_v4'),
  })
  override id!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: fn('now'),
  })
  override createdAt?: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: fn('now'),
  })
  override updatedAt?: Date;
}
