import { Server, } from '@hapi/hapi';

import { ReportData, ReportParam, } from './report-generator.interfaces';

export abstract class AbstractReport {
  abstract reportName: string;
  abstract readonly template: string;
  abstract readonly docGenerator: string;

  constructor(protected readonly server: Server) {}

  abstract generator(param: ReportParam): Promise<ReportData> | ReportData;
}
