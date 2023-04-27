import { Entity, Column, PrimaryColumn, } from 'typeorm';

@Entity()
export class Storage {
	@PrimaryColumn({
		type: 'uuid',
	})
		id!: string;

	@Column({
		type: 'bytea',
	})
		data!: Buffer;
}
