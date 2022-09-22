import { MigrationInterface, QueryRunner, Table, } from 'typeorm';

export class createUsers1652714427894 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const usersTable = new Table({
			name: 'users',
			columns: [
				{
					name: 'id',
					isPrimary: true,
					type: 'uuid',
				},
				{
					name: 'firstname',
					isNullable: false,
					type: 'varchar',
				},
				{
					name: 'lastname',
					isNullable: false,
					type: 'varchar',
				},
				{
					name: 'email',
					isNullable: false,
					type: 'varchar',
					isUnique: true,
				},
				{
					name: 'password',
					isNullable: false,
					type: 'varchar',
				}
			],
		});

		await queryRunner.createTable(usersTable);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users');
	}
}
