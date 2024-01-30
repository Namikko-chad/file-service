import { Column, DataType, Model, Table, } from 'sequelize-typescript';

@Table({
  tableName: 'Storage',
  timestamps: false,
})
export class Storage extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
  })
  declare id: string;

  @Column({
    type: DataType.BLOB,
    allowNull: false,
  })
  declare data: Buffer;
}