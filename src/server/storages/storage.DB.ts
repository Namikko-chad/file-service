
import { Column, DataType, Table, Model, Sequelize, } from 'sequelize-typescript';
import { File, } from '../db';
import { AbstractStorage, } from './abstract';
import { StorageType, } from './enum';

export class DBStorage extends AbstractStorage {
	params = {
		fileSizeLimit: 1024 * 1024 * 30,
	};
	type = StorageType.DB;

	async init(db: Sequelize): Promise<void> {
		db.addModels([Storage]);
		await db.sync();
	}

	async saveFile(file: File, data: Buffer): Promise<void> {
		await Storage.create({
			id: file.id,
			data,
		})
	}

	async loadFile(file: File): Promise<Buffer> {
		const fileData = await Storage.findByPk(file.id) as Storage;
		return fileData.data;
	}

	async deleteFile(file: File): Promise<void> {
		await Storage.destroy({
			where: {
				id: file.id,
			},
		})
	}
}

@Table({
	timestamps: false,
})
export class Storage extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		unique: true,
	})
	override id!: string;

	@Column({
		type: DataType.BLOB,
	})
		data!: Buffer;
}
