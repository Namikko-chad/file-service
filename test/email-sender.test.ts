// import { describe, beforeAll, it, } from '@jest/globals';
// import { Server, } from '@hapi/hapi';
// import { EmailSenderPlugin, loadEmailSenderConfig, } from '../src/email-sender';
// import { EmailGeneratorPlugin, EmailType, } from '../src/email-generator';

// function itIf (condition: boolean) {
// 	return condition ? it : it.skip;
// }

// describe('EmailSender', () => {
// 	const server = new Server();
  
// 	beforeAll( async () => {
// 		await server.register({
// 			plugin: EmailGeneratorPlugin,
// 		});
// 		await server.register({
// 			plugin: EmailSenderPlugin,
// 			options: loadEmailSenderConfig(),
// 		});
// 	})

// 	itIf(!!(loadEmailSenderConfig().smtpTransport.host))('send', async () => {
// 		await server.sendEmail({ to: 'test@test.ch', type: EmailType.Confirmation, fields: { code: '123456', },});
// 	})
// });