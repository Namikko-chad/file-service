import { Inject, } from '@nestjs/common';
import { JwtService, } from '@nestjs/jwt';
import FormData from 'form-data';
import * as fs from 'fs';
import fetch, { BodyInit, RequestInit, } from 'node-fetch';
import * as multipart from 'parse-multipart-data';
import * as p from 'path';
import { URL, } from 'url';

import { File, } from '../../../files';
import { Exception, } from '../../../utils';
import { AbstractStorage, } from '../storage.abstract.service';
import { GoogleDriveConfig, } from './storage.google-drive.config';
import { GoogleDriveRepository, } from './storage.google-drive.repository';

interface GoogleKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

export class GoogleDriveStorage extends AbstractStorage {
  @Inject(GoogleDriveRepository)
  private readonly _repository: GoogleDriveRepository;
  @Inject(JwtService)
  private readonly _jwtService: JwtService;
  private readonly googleKey: GoogleKey;
  private accessToken?: string;
 
  constructor(@Inject(GoogleDriveConfig) config: GoogleDriveConfig) {
    super(config);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    this.googleKey = JSON.parse(fs.readFileSync(p.resolve(config.keyFileName), { encoding: 'utf8', }).toString()) as GoogleKey;

  }

  override async init(): Promise<void> {
    await this.getAccessToken();
  }

  override close(): Promise<void> {
    return Promise.resolve();
  }

  private async getAccessToken(): Promise<void> {
    const jwtToken = this._jwtService.sign({
      iss: this.googleKey.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: this.googleKey.token_uri,
    }, {
      algorithm: 'RS256',
      privateKey: this.googleKey.private_key,
      expiresIn: 60*60,
    });
    const body: BodyInit = JSON.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken,
    });

    try {
      
      const response = await this.request<{
        access_token: string;
        expires_in: number;
        token_type: 'Bearer';
      }>('POST', 'https://oauth2.googleapis.com/token', undefined, body);
    
      this.accessToken = response.access_token;
    } catch (error) {
      this.enabled = false;
      this._logger.warn(`${this.constructor.name} disabled`);
      throw error;
    }
  }

  private apiURL(route: string): URL {
    return new URL(route);
  }

  private async request<Res>(
    method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    query?: Record<string, string | readonly string[]>,
    payload?: FormData | object | string
  ): Promise<Res> {
    try {
      this._logger.log(`${method}, ${endpoint}`);
      const url = this.apiURL(endpoint);
      new URLSearchParams(query).forEach((value,name) => {
        url.searchParams.append(name,value);
      });
      let body: string | FormData | BodyInit;

      if (payload instanceof FormData || typeof payload === 'string') {
        body = payload;
      } else {
        body = JSON.stringify(payload);
      }

      const req: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Connection': 'close',
        },
        body,
      };

      if (payload instanceof FormData) {
        Object.assign(req.headers, { 'Content-Type': 'multipart/form-data', });
      } else if (typeof payload === 'string') {
        Object.assign(req.headers, { 'Content-Type': 'text/plain', });
      } else {
        Object.assign(req.headers, { 'Content-Type': 'application/json', });
      }

      const response = await fetch(url, req);
      const contentType = response.headers.get('Content-Type');

      if (!response.ok) {
        this._logger.error(`Failed to request. Status: ${response.status} ${response.statusText}`);
        throw new Exception(response.status, 'Failed send request', response as unknown as Readonly<Record<string, unknown>>);
      }

      if (contentType.includes('application/json'))
        return response.json() as unknown as Res;

      return response.buffer() as unknown as Res;
    } catch (error) {
      throw error;
    }
  }

  async saveFile(file: File, data: Buffer): Promise<void> {
    const payload = new FormData();
    payload.append('content', data);

    await this.getAccessToken();
    const res = await this.request<{
      kind: string;
      id: string;
      name: string;
      mimeType: string;
    }>('POST', 'https://www.googleapis.com/upload/drive/v3/files', {
      uploadType: 'media',
    }, payload);
    const driveFile = this._repository.create({
      fileId: file.id,
      driveId: res.id,
    });
    await this._repository.save(driveFile);
  }

  async loadFile({ id: fileId, }: File): Promise<Buffer> {
    const drive = await this._repository.findOneBy({
      fileId,
    });
    await this.getAccessToken();
    const buffer = await this.request<Buffer>('GET', `https://www.googleapis.com/drive/v3/files/${drive.driveId}`, {
      alt: 'media',
    });
    const boundary = buffer.toString().split('\n')[0];
    const parsed = multipart.parse(buffer, boundary.slice(2, boundary.length-1));

    return parsed[0].data;
  }

  async deleteFile({ id: fileId, }: File): Promise<void> {
    const drive = await this._repository.findOneBy({
      fileId,
    });
    await this.getAccessToken();
    await this.request('DELETE', `https://www.googleapis.com/drive/v3/files/${drive.driveId}`);
  }
}
