// import { beforeEach, describe, expect, it, beforeAll, afterAll, } from '@jest/globals';
// import { Server, } from '@hapi/hapi';
// import PizZip from 'pizzip';
// import { DocumentGenerator, } from '../src/document-generator/document-generator.handler';
// import { DOCX_MIME_TYPE, } from '../src/document-generator/document-meta';

// describe('DocumentGenerator', () => {
// 	let docGen: DocumentGenerator;
// 	let server: Server;

// 	beforeAll(async () => {
// 		server = new Server();

// 		await server.start();
// 	});

// 	afterAll(async () => {
// 		await server.stop();
// 	});

// 	beforeEach(() => {
// 		docGen = new DocumentGenerator(server, {
// 			templatesDir: './packages/queue-service/test/templates',
// 		});
// 	});

// 	describe('generateDocument', () => {
// 		it('generates document', async () => {
// 			const docData = await docGen.generateDocument(
// 				{
// 					name: 'Test template',
// 					meta: {
// 						template: 'test-template.dotx',
// 					},
// 				},
// 				{
// 					testValue: 'SOME TEXT',
// 				}
// 			);

// 			expect(docData.name).toBe('Test template.docx');
// 			expect(docData.type).toBe(DOCX_MIME_TYPE);

// 			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// 			// @ts-ignore
// 			const xml = new PizZip(docData.content).file('word/document.xml').asBinary();

// 			expect(xml).toContain('SOME TEXT');
// 		});

// 		it('respects explicit document meta', async () => {
// 			const docData = await docGen.generateDocument(
// 				{
// 					name: 'Test template',
// 					meta: {
// 						name: 'Test document',
// 						template: 'test-template.dotx',
// 					},
// 				},
// 				{
// 					testValue: 'SOME TEXT',
// 				}
// 			);

// 			expect(docData.name).toBe('Test document');
// 		});
// 	});
// });
