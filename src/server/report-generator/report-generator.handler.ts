import { Server, } from '@hapi/hapi';
import { xlsxEmptyTemplate } from 'server/document-generator';
import { DocumentMeta } from 'server/document-generator/document-generator.interfaces';
import { File } from '../db';
import { AbstractReport, } from './abstract-report';
import { ReportList } from './report-generator.plugin';

export class ReportHandler {
	private reports = new Map<ReportList | string, AbstractReport>();

	constructor(private readonly server: Server) {}

	public registerReport(report: ReportList | string, worker: AbstractReport): void {
		this.reports.set(report, worker);
	}

	public async create(reportType: ReportList | string): Promise<File> {
		const report = this.reports.get(reportType);
		if (!report)
			throw new ReferenceError('Unknown report type');
		const data = await report.generator();
		const meta: DocumentMeta = {
			name: report.reportName,
			template: xlsxEmptyTemplate.name,
		}
		const { content, name, mime, } = await this.server.app.documentGenerator.create('xlsx', meta, data);
		const file = await this.server.app.storage.saveFile({
			filename: name,
			headers: {
				'Content-Type': mime
			},
			payload: content
		});
		return file;
	}
}
