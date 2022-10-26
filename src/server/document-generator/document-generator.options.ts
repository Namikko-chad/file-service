/**
 * Documents generator options.
 */
export interface DocumentGeneratorOptions {
  /**
   * Directory containing document template files.
   *
   * Defaults to `$CWD/templates`.
   */
  readonly templatesDir?: string | undefined;
}
