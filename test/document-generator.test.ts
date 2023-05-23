import { beforeAll, describe, expect, it } from '@jest/globals';
import { DocumentGenerator } from '../src/server/document-generator/document-generator.handler';
import { docxGenerator } from '../src/server/document-generator/generator.docx';
import { xlsxGenerator } from '../src/server/document-generator/generator.xlsx';
import { htmlGenerator } from '../src/server/document-generator/generator.html';

import { AbstractTemplate, xlsxEmptyTemplate } from '../src/server/document-generator';

export class htmlTemplate extends AbstractTemplate {
  name = 'test-html';

  public override async loadTemplate(): Promise<Buffer> {
    return Buffer.from('<html>{{code}}</html>');
  }
}

export class docxTemplate extends AbstractTemplate {
  name = 'template.docx';
}

describe('DocumentGenerator', () => {
  const documentGenerator = new DocumentGenerator();

  beforeAll(() => {
    documentGenerator.registerGenerator('docx', new docxGenerator({}));
    documentGenerator.registerGenerator('xlsx', new xlsxGenerator({}));
    documentGenerator.registerGenerator('html', new htmlGenerator({}));
    documentGenerator.registerTemplate(
      'test-docx',
      new docxTemplate({
        templatesDir: './test/file/',
      }),
    );
    documentGenerator.registerTemplate('test-html', new htmlTemplate({}));
    documentGenerator.registerTemplate('test-xlsx', new xlsxEmptyTemplate({}));
  });

  it('should generate html document', async () => {
    const docData = await documentGenerator.create(
      'html',
      {
        name: 'test',
        template: 'test-html',
      },
      {
        code: 123456,
      },
    );
    expect(docData.name).toBe('test.html');
    expect(docData.mime).toBe(new htmlGenerator({}).mime);
    expect(docData.content.toString()).toContain('123456');
  });

  it('should generate docx document', async () => {
    const docData = await documentGenerator.create(
      'docx',
      {
        name: 'test',
        template: 'test-docx',
      },
      {
        firstName: 123456,
      },
    );
    expect(docData.name).toBe('test.docx');
    expect(docData.mime).toBe(new docxGenerator({}).mime);
    expect(docData.content.toString()).toContain('123456');
  });

  it('should generate xlsx document', async () => {
    const docData = await documentGenerator.create(
      'xlsx',
      {
        name: 'test',
        template: 'test-xlsx',
      },
      [['123456']],
    );
    expect(docData.name).toBe('test.xlsx');
    expect(docData.mime).toBe(new xlsxGenerator({}).mime);
    expect(docData.content.toString()).toContain('123456');
  });
});
