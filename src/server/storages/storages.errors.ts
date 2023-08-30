export enum StoragesErrors {
  FileNotFound = 404002,
}

export const StoragesErrorsMessages: Record<StoragesErrors, string> = {
  [StoragesErrors.FileNotFound]: 'File: Not found',
};
