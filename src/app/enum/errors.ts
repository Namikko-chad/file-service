export enum Errors {
	// Unauthorized (401)
	TokenExpired = 401001,
	TokenInvalid = 401002,
	// Forbidden (403)
	FileIsPrivate = 403001,
	// Not found (404)
	UserNotFound = 404001,
	FileNotFound = 404002,
	// Conflict (409)
	StorageLimit = 409001,
}

export const ErrorsMessages = {
	[Errors.FileIsPrivate]: 'File: Private',
	[Errors.FileNotFound]: 'File: Not found',
	[Errors.StorageLimit]: 'Storage limit',
	[Errors.TokenExpired]: 'Token expired',
	[Errors.TokenInvalid]: 'Invalid token',
	[Errors.UserNotFound]: 'User: Not found',
};
