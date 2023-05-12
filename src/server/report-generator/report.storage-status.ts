import { File, } from '../db';
import { xlsxEmptyTemplate, xlsxGenerator, } from '../document-generator';
import { StorageType, } from '../storages';
import { AbstractReport, } from './abstract-report';
import { ReportData, } from './report-generator.interfaces';

export class StorageStatusReport extends AbstractReport {
  logPrefix = '[Report:StorageStatus:generator]';
  reportName = 'Report about storage status';
  columnName = ['storage', 'files count', 'used space'];
  template = xlsxEmptyTemplate.name;
  docGenerator = xlsxGenerator.name;

  async generator(): Promise<ReportData> {
    const table: string[][] = [this.columnName];
    await Promise.all(
      Object.values(StorageType).map(async (storage) => {
        const filesCount = await File.count({
          where: {
            storage,
          },
        });
        const usedSpace = await File.sum('size', {
          where: {
            storage,
          },
        });
        table.push([storage, String(filesCount), String(usedSpace ?? 0)]);
      })
    );

    return table;
  }
}
