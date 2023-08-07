
export enum Errors {
  FileIsPrivate = 403001,
  UserNotFound = 404001,
  FileNotFound = 404002,
}

export const ErrorsMessages: Record<Errors, string> = {
  [Errors.FileIsPrivate]: 'File: Private',
  [Errors.FileNotFound]: 'File: Not found',
  [Errors.UserNotFound]: 'User: Not found',
};