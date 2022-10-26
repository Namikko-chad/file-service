import { AbstractReport, } from './abstract-report';
import { ReportData, } from './report-generator.interfaces';

export class UserFilesReport extends AbstractReport {
	logPrefix = '[Report:UserFiles:generator]';
	reportName = 'Report about user files';
	columnName = ['user id', 'files count', 'used space'];

	generator(): ReportData {
		const table: string[][] = [this.columnName, ['234', '2345', '2344']];
		return table;
	}
}
