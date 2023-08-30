export enum AuthErrors {
  TokenExpired = 401001,
  TokenInvalid = 401002,
}

export const AuthErrorsMessages: Record<AuthErrors, string> = {
  [AuthErrors.TokenExpired]: 'Token expired',
  [AuthErrors.TokenInvalid]: 'Invalid token',
};
