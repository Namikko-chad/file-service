import { Server, } from '@hapi/hapi';
import { DocumentMeta, } from '../document-generator';
import { File, } from '../db';
import { AbstractReport, } from './abstract-report';
import { ReportParam, } from './report-generator.interfaces';
import { ReportList, } from './report-generator.plugin';

export class ReportHandler {
	private reports = new Map<ReportList | string, AbstractReport>();

	constructor(private readonly server: Server) {}

	public registerReport(report: ReportList | string, worker: AbstractReport): void {
		this.reports.set(report, worker);
	}

	public async create(reportType: ReportList | string, reportParam: ReportParam): Promise<[File, Buffer]> {
		const report = this.reports.get(reportType);
		if (!report) throw new ReferenceError('Unknown report type');
		const data = await report.generator(reportParam);
		const meta: DocumentMeta = {
			name: report.reportName,
			template: report.template,
		};
		const { content, name, mime, } = await this.server.app.documentGenerator.create(
			report.docGenerator,
			meta,
			data
		);
		const file = await this.server.app.storage.saveFile({
			filename: name,
			headers: {
				'Content-Type': mime,
			},
			payload: content,
		});
		return [file, content];
	}
}
