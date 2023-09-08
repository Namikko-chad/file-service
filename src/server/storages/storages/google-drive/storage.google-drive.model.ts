import { Column, DataType, Model, Table, } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'GoogleDrive',
})
export class GoogleDrive extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
  })
  declare fileId: string;

  @Column({
    type: DataType.UUID,
  })
  declare driveId: string;
}
