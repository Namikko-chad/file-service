'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FileServicePlugin = void 0;
const handler_1 = require('./handler');
exports.FileServicePlugin = {
	name: 'fileServicePlugin',
	version: '2.1.0',
	register(server, options) {
		const service = new handler_1.FileServiceHandler(options);
		server.decorate('server', 'fsCreateToken', service.createToken.bind(service));
		server.decorate('server', 'fsValidateToken', service.validateToken.bind(service));
		server.decorate('server', 'fsGetDirectLink', service.getDirectLink.bind(service));
		server.decorate('server', 'fsCreate', service.create.bind(service));
		server.decorate('server', 'fsEdit', service.edit.bind(service));
		server.decorate('server', 'fsGet', service.get.bind(service));
		server.decorate('server', 'fsInfo', service.info.bind(service));
		server.decorate('server', 'fsDestroy', service.destroy.bind(service));
	},
};
//# sourceMappingURL=plugin.js.map
