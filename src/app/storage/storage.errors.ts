export enum Errors {
  // Not found (404)
  FileNotFound = 404002,
  // Conflict (409)
  StorageLimit = 409001,
}

export const ErrorsMessages = {
  [Errors.FileNotFound]: 'File: Not found',
  [Errors.StorageLimit]: 'Storage limit',
};
