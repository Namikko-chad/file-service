export type DocumentInput = 
	Record<string, string> | 
	Buffer | 
	any

export interface DocumentTemplate {
	/**
	 * Template name.
	 */
	readonly name: string;
}

export interface DocumentMeta {
	/**
	 * Generated document name.
	 *
	 * Defaults to template name.
	 */
	readonly name: string;

	/**
	 * Either template file path relative to {@link DocgenOptions.templatesDir templates root}, or `Buffer` containing
	 * template data.
	 */
	readonly template: string;
}

export interface DocumentData extends DocumentMeta {
	/**
	 * Generated document's MIME type.
	 *
	 * Detected by template file name by default.
	 */
	readonly mime: string;

  /**
	 * Generated document's MIME type.
	 *
	 * Detected by template file name by default.
	 */
	readonly ext: string;

	/**
	 * Generated document's content.
	 */
	readonly content: Buffer;
}