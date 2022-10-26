import { Server, } from '@hapi/hapi';
import { ReportData, } from './report-generator.interfaces';

export abstract class AbstractReport {
	abstract reportName: string;

	constructor(protected readonly server: Server) {}

	abstract generator(): Promise<ReportData> | ReportData;
}
