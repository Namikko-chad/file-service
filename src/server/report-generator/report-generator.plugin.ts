import { Plugin, Server, } from '@hapi/hapi';

import { StorageStatusReport, } from './report.storage-status';
import { ReportHandler, } from './report-generator.handler';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    reports: ReportHandler;
  }
}

export enum ReportList {
  StorageStatus = 'storage-status',
}

export const ReportGeneratorPlugin: Plugin<unknown> = {
  name: 'report-generator',
  register(server: Server): void {
    server.app.reports = new ReportHandler(server);
    server.app.reports.registerReport(ReportList.StorageStatus, new StorageStatusReport(server));
  },
  dependencies: ['database', 'document-generator'],
};
