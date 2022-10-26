export type DatabaseOptions = Partial<{
	/**
	 * database server link
	 */
	readonly link: string | undefined;

	/**
	 * database server host
	 */
	readonly host: string | undefined;

	/**
	 * database server port
	 */
	readonly port: number | undefined;

	/**
	 * database server username
	 */
	readonly username: string | undefined;

	/**
	 * database server password
	 */
	readonly password: string | undefined;

	/**
	 * database name
	 */
	readonly database: string | undefined;

	/**
	 * database dialect
	 */
	readonly dialect: 'postgres' | 'sqlite' /* currently supported */;

	readonly development: boolean | undefined;
	readonly test: boolean | undefined;
	/**
	 * test database server link
	 */
	readonly test_link: string | undefined;

	readonly logging: boolean | undefined;
}>;
