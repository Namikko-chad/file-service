import crypto from 'crypto';

export function getHash(data: Buffer): string {
	const hash_md5 = crypto.createHash('md5');
	hash_md5.update(data);
	return hash_md5.digest('hex');
}