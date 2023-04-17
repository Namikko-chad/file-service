import { Entity, Column, } from 'typeorm';
import { AbstractEntity, } from 'app/database/AbstractEntity';

@Entity()
export class File extends AbstractEntity {
	@Column({
		length: 10,
	})
		ext!: string;

	@Column({
		length: 255,
	})
		mime!: string;

	@Column({
		type: 'bigint',
	})
		size!: number;

	@Column({
		default: 'db',
		length: 255,
	})
		storage!: string;

	@Column({
		length: 255,
	})
		hash!: string;

	@Column({
		type: 'bytea',
		nullable: true,
		select: false,
	})
		data?: Buffer;
}
