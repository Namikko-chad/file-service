import { Plugin, Server, } from '@hapi/hapi';
import { FileServiceHandler, } from './handler';
import { FileServiceOptions, FileServiceServerAddons, } from './interfaces';

declare module '@hapi/hapi' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface Server extends FileServiceServerAddons {}
}

export const FileServicePlugin: Plugin<FileServiceOptions> = {
	name: 'fileServicePlugin',
	version: '2.1.0',
	register(server: Server, options: FileServiceOptions) {
		const service = new FileServiceHandler(options);

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
