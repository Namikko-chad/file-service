import { Column, DataType, Table, Scopes, HasMany, } from 'sequelize-typescript';
import { fn, } from 'sequelize';
import { StorageType, } from '../../storages';
import { FileUser, } from './FileUsers';
import { AbstractModel, } from './abstract/AbstractModel';

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
export class File extends AbstractModel {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		unique: true,
		defaultValue: fn('uuid_generate_v4'),
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

	@Column({
		type: DataType.BLOB,
	})
		data?: Buffer;

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

	@HasMany(() => FileUser)
		fileUsers?: FileUser[];
}
