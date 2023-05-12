import { describe, it, expect, beforeAll } from '@jest/globals';
import { Server } from '@hapi/hapi';
import { ReportGeneratorPlugin } from '../src/server/report-generator';
import { StorageStatusReport } from '../src/server/report-generator/report.storage-status';
import { Database, loadDatabaseConfig } from '../src/server/db';

describe('ReportGenerator', () => {
  const server = new Server();

  beforeAll(async () => {
    await server.register({
      plugin: Database,
      options: loadDatabaseConfig(),
    });
  });

  describe('Plugin', () => {
    it('should report plugin', async () => {
      await server.register({
        plugin: ReportGeneratorPlugin,
      });
    });
  });

  describe('Reports', () => {
    it('should generate storage-status report', async () => {
      const report = new StorageStatusReport(server);
      const res = await report.generator();
      expect(res).toStrictEqual([
        ['storage', 'files count', 'used space'],
        ['folder', '0', '0'],
        ['db', expect.any(String), expect.any(String)],
      ]);
    });
  });
});
