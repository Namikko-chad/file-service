import { Column, DataType, Model, Table, Scopes, } from 'sequelize-typescript';
import { StorageType, } from '../../enum';
import { getUUID, } from '../../utils/index';

@Scopes(() => ({
	defaultScope: {
		attributes: {
			exclude: ['data', 'createdAt', 'updatedAt'],
		},
	},
	withData: {
		attributes: {
			include: ['data'],
		},
	},
}))
@Table({})
export class FileStorage extends Model {
  @Column({
  	type: DataType.UUID,
  	primaryKey: true,
  	unique: true,
  	defaultValue: () => getUUID(),
  })
	override id!: string;

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
  	type: DataType.STRING,
  	defaultValue: StorageType.DB,
  })
  	storage!: StorageType;

  @Column({
  	type: DataType.STRING(),
  	allowNull: false,
  })
  	hash!: string;

  @Column({
  	type: DataType.BLOB,
  })
  	data?: Buffer;
}
