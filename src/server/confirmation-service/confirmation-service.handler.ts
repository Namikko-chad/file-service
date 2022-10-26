import { Server, } from '@hapi/hapi';
import { compareSync, hash, } from 'bcrypt';
import { generate, } from 'generate-password';
import { config, } from '../config';
import { Exception, } from '../utils/Exception';
import { getUUID, } from '../utils/common';
import { ConfirmationProviderList, } from '../confirmation-provider/confirmation-provider.enum';
import { ConfirmationData, } from './confirmation-service.interfaces';
import { ConfirmationProviderDefaults, } from './confirmation-provider.defaults';
import { ConfirmationStatus, } from './confirmation-service.enum';

export enum ConfirmationErrors {
	NotFound = 404441,
	NotSent = 400442,
	NotConfirmed = 403443,
	Used = 403444,
	Expired = 401445,
	Deactivated = 403446,
	Incorrect = 400447,
	TooManyRequest = 429448,
}

export const ConfirmationErrorsMessages = {
	[ConfirmationErrors.NotFound]: 'Confirmation: code not found',
	[ConfirmationErrors.NotSent]: 'Confirmation: Code wasn\'t sent',
	[ConfirmationErrors.NotConfirmed]: 'Confirmation: code not confirmed',
	[ConfirmationErrors.Used]: 'Confirmation: code already used',
	[ConfirmationErrors.Expired]: 'Confirmation: code expired',
	[ConfirmationErrors.Deactivated]: 'Confirmation: code deactivated',
	[ConfirmationErrors.Incorrect]: 'Confirmation: code incorrect',
	[ConfirmationErrors.TooManyRequest]: 'Confirmation: Too many request',
};

export class ConfirmationServiceHandler {
	constructor(protected readonly server: Server) {}

	/**
	 * Method for create confirmation object
	 * @param _to destination where will send code
	 * @param _provider who will send code
	 * @returns ConfirmationData
	 */
	create(_to: string, _provider?: ConfirmationProviderList): ConfirmationData {
		const logPrefix = '[ConfirmationService:create]';
		console.log(logPrefix, `Create code to ${_to} through ${_provider || 'default provider'}`);
		const provider = _provider || ConfirmationProviderList.EMAIL;
		const data: ConfirmationData = {
			id: getUUID(),
			provider,
			to: _to,
			counter: ConfirmationProviderDefaults[`${provider}`].count,
			createdAt: Date.now(),
			confirmed: false,
			status: ConfirmationStatus.Created,
		};
		if (config.debug) console.debug(logPrefix, 'Debug', data);
		return data;
	}

	/**
	 * Method for send code
	 * @param _data ConfirmationData from create method
	 * @returns ConfirmationData
	 */
	async send(_data: ConfirmationData): Promise<ConfirmationData> {
		const logPrefix = `[ConfirmationService:send:${_data.id}]`;
		console.log(logPrefix, `Send code to ${_data.to} through ${_data.provider}`);
		_data.error = null;
		if (_data.status === ConfirmationStatus.Sent && !this.checkLifetime(_data)) {
			return _data;
		}
		const rdmCode = generate(ConfirmationProviderDefaults[`${_data.provider}`].generator);
		// await this.server.mqSend<ConfirmationProviderMqRequest>('confirmation', {
		// 	type: 'send',
		// 	provider: _data.provider,
		// 	data: {
		// 		to: _data.to,
		// 		code: rdmCode,
		// 	},
		// });
		_data.code = await hash(rdmCode, 10);
		_data.status = ConfirmationStatus.Sent;
		_data.sentAt = Date.now();
		_data.expires = Date.now() + 300000;
		if (config.development || config.test) _data.test = rdmCode;
		if (config.debug) console.debug(logPrefix, 'Debug', _data);
		return _data;
	}

	/**
	 * Method for user code verification
	 * @param _data ConfirmationData from create method
	 * @param _code string from client
	 * @returns ConfirmationData
	 */
	verify(_data: ConfirmationData, _code: string): ConfirmationData {
		/* eslint-disable @typescript-eslint/unbound-method */
		const logPrefix = `[ConfirmationService:verify:${_data.id}]`;
		console.log(logPrefix, `Verify code ${_code}`);
		_data.error = null;
		if (!config.development) {
			if (_data.counter) _data.counter--;
			const checks: Array<(_data: ConfirmationData, _code: string) => boolean | Promise<boolean>> =
				[this.checkAttempts, this.checkStatus, this.checkExpires, this.checkEqual];
			for (const check of checks) {
				if (!check(_data, _code)) {
					return _data;
				}
			}
		}
		_data.code = '';
		_data.counter = ConfirmationProviderDefaults[`${_data.provider}`].count;
		_data.status = ConfirmationStatus.Confirmed;
		_data.confirmed = true;
		_data.confirmedAt = Date.now();
		if (config.debug) console.debug(logPrefix, 'Debug', _data);
		return _data;
	}

	private checkStatus(_data: ConfirmationData): boolean {
		if (_data.status === ConfirmationStatus.Created) {
			_data.error = new Exception(
				ConfirmationErrors.NotSent,
				ConfirmationErrorsMessages[ConfirmationErrors.NotSent],
				{
					attempts: _data.counter,
				}
			);
			return false;
		}
		if (_data.status === ConfirmationStatus.Confirmed) {
			_data.error = new Exception(
				ConfirmationErrors.Used,
				ConfirmationErrorsMessages[ConfirmationErrors.Used]
			);
			return false;
		}
		return true;
	}

	private checkLifetime(_data: ConfirmationData): boolean {
		if (_data.sentAt && _data.sentAt + 60000 > Date.now()) {
			_data.error = new Exception(
				ConfirmationErrors.TooManyRequest,
				ConfirmationErrorsMessages[ConfirmationErrors.TooManyRequest]
			);
			return false;
		}
		return true;
	}

	private checkExpires(_data: ConfirmationData): boolean {
		if (_data.expires && _data.expires < Date.now()) {
			_data.error = new Exception(
				ConfirmationErrors.Expired,
				ConfirmationErrorsMessages[ConfirmationErrors.Expired]
			);
			return false;
		}
		return true;
	}

	private checkAttempts(_data: ConfirmationData): boolean {
		if (!_data.counter) {
			_data.error = new Exception(
				ConfirmationErrors.Deactivated,
				ConfirmationErrorsMessages[ConfirmationErrors.Deactivated],
				{ attempts: _data.counter, }
			);
			return false;
		}
		return true;
	}

	private checkEqual(_data: ConfirmationData, _code: string): boolean {
		if (_data.code && !compareSync(String(_code), _data.code)) {
			_data.error = new Exception(
				ConfirmationErrors.Incorrect,
				ConfirmationErrorsMessages[ConfirmationErrors.Incorrect],
				{
					attempts: _data.counter,
				}
			);
			return false;
		}
		return true;
	}
}
