import { DefaultNamingStrategy, NamingStrategyInterface, Table, } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	override tableName(targetName: string, userSpecifiedName?: string): string {
		return userSpecifiedName ?? `${targetName}s`;
	}

	override primaryKeyName(tableOrName: Table | string): string {
		return `${typeof tableOrName === 'string' ? tableOrName : tableOrName.name}_pkey`;
	}
}
