export enum FilesErrors {
  FileIsPrivate = 403001,
  FileNotFound = 404002,
}

export const FilesErrorsMessages: Record<FilesErrors, string> = {
  [FilesErrors.FileIsPrivate]: 'File: Private',
  [FilesErrors.FileNotFound]: 'File: Not found',
};
