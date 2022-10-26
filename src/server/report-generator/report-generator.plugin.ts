import { Plugin, Server, } from '@hapi/hapi';
import { ReportHandler, } from './report-generator.handler';
import { UserFilesReport, } from './report.UserFiles';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    reports: ReportHandler;
  }
}

export enum ReportList {
  UserFiles = 'user-files',
}

export const ReportPlugin: Plugin<unknown> = {
	name: 'report-generator',
	register(server: Server): void {
		server.app.reports = new ReportHandler(server);
		server.app.reports.registerReport(
			ReportList.UserFiles,
			new UserFilesReport(server)
		);
	},
	dependencies: ['database', 'document-generator'],
};
