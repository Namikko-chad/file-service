import { Column, DataType, Model, Table, Scopes, HasMany, } from 'sequelize-typescript';
import { StorageType, } from '../../storages';
import { getUUID, } from '../../utils/index';
import { FileUser, } from './FileUsers';

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
export class File extends Model {
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

	@HasMany(() => FileUser)
		fileUsers?: FileUser[]
}
