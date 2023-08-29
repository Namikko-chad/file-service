import { describe, beforeAll, it, expect, beforeEach } from '@jest/globals';
import { Server } from '@hapi/hapi';
import {
  ConfirmationData,
  ConfirmationStatus,
  ConfirmationProviderDefaults,
  ConfirmationServicePlugin,
  ConfirmationErrors,
} from '../src/server/confirmation-service';
import { Exception } from '../src/server/utils';
import { ConfirmationProviderList } from '../src/server/confirmation-provider/confirmation-provider.enum';
import { ConfirmationProviderPlugin } from '../src/server/confirmation-provider';

describe('Confirmation service', () => {
  const server = new Server();
  const to = '+79138779782';
  let data: ConfirmationData;
  const expiredData: ConfirmationData = {
    id: 'a576b862-ef25-4e1e-8361-314b2e0ae7ec',
    provider: ConfirmationProviderList.TEST,
    to: '+79138779782',
    counter: 4,
    createdAt: 1649705918419,
    sentAt: 1649745918482,
    expires: 1649705918419,
    confirmed: false,
    status: ConfirmationStatus.Sent,
    error: null,
    code: '$2b$10$SR3pbr29tdmAWS/JhHJ2UeygLZiz..2Wm2oR0JDujYIaH2tqLE6Zu',
    test: 'fHgJPJgnCc',
  };
  const zeroAttempts: ConfirmationData = {
    id: 'a576b862-ef25-4e1e-8361-314b2e0ae7ec',
    provider: ConfirmationProviderList.TEST,
    to: '+79138779782',
    counter: 0,
    createdAt: 1649705918419,
    sentAt: 1649745918482,
    expires: 1649705918419,
    confirmed: false,
    status: ConfirmationStatus.Sent,
    error: null,
    code: '$2b$10$SR3pbr29tdmAWS/JhHJ2UeygLZiz..2Wm2oR0JDujYIaH2tqLE6Zu',
    test: 'fHgJPJgnCc',
  };

  beforeAll(async () => {
    process.env['DEBUG'] = 'true';
    console.log(process.env['DEBUG'])
    await server.register({
      plugin: ConfirmationServicePlugin,
    });
    await server.register({
      plugin: ConfirmationProviderPlugin,
    });
  });

  beforeEach(() => {
    data = server.confirmationCreate(to, ConfirmationProviderList.TEST);
  })

  describe('Full flow', () => {
    it('should return confirmation object', () => {
      expect(data).toEqual({
        id: expect.any(String),
        provider: ConfirmationProviderList.TEST,
        to,
        counter: 5,
        createdAt: expect.any(Number),
        confirmed: false,
        status: ConfirmationStatus.Created,
      });
    });

    it('should send confirmation request to provider plugin', async () => {
      data = await server.confirmationSend(data);
      expect(data.code).toStrictEqual(expect.any(String));
      expect(data.sentAt).toStrictEqual(expect.any(Number));
      expect(data.status).toStrictEqual(ConfirmationStatus.Sent);
      expect(data.error).toBeNull();
    });

    it('should return exception', async () => {
      data = server.confirmationVerify(data, '23423455');
      expect(data.error).toBeInstanceOf(Exception);
      expect(data.counter).toBe(4);
    });

    it('should verify code', async () => {
      data = await server.confirmationSend(data);
      data = server.confirmationVerify(data, String(data.test));
      expect(data.status).toStrictEqual(ConfirmationStatus.Confirmed);
      expect(data.error).toBeNull();
    });

    it('should return exception, trying verify code 6 times', async () => {
      const data = server.confirmationVerify(zeroAttempts, '23423455');
      expect(data.error).toBeInstanceOf(Exception);
      expect(data.counter).toBe(0);
    });

    it('should return exception, trying expires code', async () => {
      const data = server.confirmationVerify(expiredData, '23423455');
      expect(data.error).toBeInstanceOf(Exception);
    });

    it('should check counter', async () => {
      let data: ConfirmationData;
      data = server.confirmationCreate(to, ConfirmationProviderList.TEST);
      data = await server.confirmationSend(data);
      let attempts: number = 1;
      for (let i = 0; i < ConfirmationProviderDefaults[ConfirmationProviderList.TEST].count + 1; i++) {
        data = server.confirmationVerify(data, '');
        if (data.error?.code !== ConfirmationErrors.Deactivated) attempts++;
      }
      expect(attempts).toBe(ConfirmationProviderDefaults[ConfirmationProviderList.TEST].count);
    });
  });
});
