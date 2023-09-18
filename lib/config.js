'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.loadFileServiceConfig = void 0;
const dotenv_1 = require('dotenv');
let fileServiceConfig;
function loadFileServiceConfig() {
	if (!fileServiceConfig) {
		(0, dotenv_1.config)();
		fileServiceConfig = {
			apiUrl: process.env.FILE_SERVICE_URL,
			fileAccess: {
				secret: process.env.FA_SECRET,
				expired: Number(process.env.FA_LIFETIME) || undefined,
			},
			userAccess: {
				secret: process.env.UA_SECRET,
				expired: Number(process.env.UA_LIFETIME) || undefined,
			},
			adminAccess: {
				secret: process.env.AA_SECRET,
				expired: Number(process.env.AA_LIFETIME) || undefined,
			},
		};
	}
	return fileServiceConfig;
}
exports.loadFileServiceConfig = loadFileServiceConfig;
//# sourceMappingURL=config.js.map
