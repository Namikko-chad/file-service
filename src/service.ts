/* eslint-disable security/detect-object-injection */
import { Inject, Injectable, Logger, } from '@nestjs/common';
import { JwtService, } from '@nestjs/jwt';
import FormData from 'form-data';
import fetch, { BodyInit, HeadersInit, } from 'node-fetch';
import { URL, } from 'url';

import { FileServiceConnectorConfig, } from './config';
import { Token, } from './enum';
import { Exception, } from './Exception';
import { FileCred, FileEdit, FileInfo, FileUpload, JwtPayload, } from './interfaces';

interface UserAuthData {
  readonly userId?: string;
  readonly timestamp: number;
}

interface FileServicePOSTResponse {
  ok: true;
  result: FileInfo;
}

@Injectable()
export class FileServiceConnectorService {
  private readonly logger = new Logger('File-service');

  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(FileServiceConnectorConfig) private readonly config: FileServiceConnectorConfig
  ) {}
  
  // private apiURL(route: string): URL {
  //   return new URL(route);
  // }

  // async request<Res>(
  //   method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE',
  //   endpoint: string,
  //   query?: Record<string, string | readonly string[]>,
  //   payload?: FormData | object | string,
  //   headers?: HeadersInit
  // ): Promise<Res> {
  //   try {
  //     this.logger.log(`${method}, ${endpoint}`);
  //     const url = this.apiURL(endpoint);
  //     new URLSearchParams(query).forEach((value,name) => {
  //       url.searchParams.append(name,value);
  //     });
  //     let body: string | FormData | BodyInit;

  //     if (payload instanceof FormData || typeof payload === 'string') {
  //       body = payload;
  //     } else {
  //       body = JSON.stringify(payload);
  //     }

  //     const req = {
  //       method,
  //       headers: {
  //         ...headers,
  //         'Accept': 'application/json',
  //         'Connection': 'close',
  //       },
  //       body,
  //     };

  //     if (payload instanceof FormData) {
  //       Object.assign(req.headers, { 'Content-Type': 'multipart/form-data', });
  //     } else if (typeof payload === 'string') {
  //       Object.assign(req.headers, { 'Content-Type': 'text/plain', });
  //     } else {
  //       Object.assign(req.headers, { 'Content-Type': 'application/json', });
  //     }

  //     const response = await fetch(url, req);
  //     const contentType = response.headers.get('Content-Type');

  //     if (!contentType)
  //       throw ReferenceError('Content-Type not set');

  //     if (!response.ok) {
  //       this.logger.error(`Failed to request. Status: ${response.status} ${response.statusText}`);
  //       throw new Exception(response.status, 'Failed send request', await response.json() as unknown as Readonly<Record<string, unknown>>);
  //     }

  //     if (contentType.includes('application/json'))
  //       return response.json() as Promise<Res>;

  //     return response.buffer() as unknown as Promise<Res>;
  //   } catch (error) {
  //     if (error instanceof Exception) {
  //       this.logger.error(error.message, error.data);
  //     } else {
  //       const err = error as Error;
  //       this.logger.error(err.message);
  //     }

  //     throw error;
  //   }
  // }

  public fileURL(fileId: string, route?: 'info'): URL {
    let path = `files/${fileId}`;

    if (route) {
      path += `/${route}`;
    }

    return new URL(path, this.config.apiUrl);
  }

  public getDirectLink(_cred: FileCred): URL {
    const url = this.fileURL(_cred.fileId);

    url.searchParams.set('access_token', this.createToken(Token.File, _cred));

    return url;
  }

  public createToken(_tokenType: Token, _cred: Partial<FileCred>): string {
    const data: UserAuthData = {
      ..._cred,
      timestamp: Date.now(),
    };
    const { secret, expired: expiresIn, } = this.config[_tokenType];
    
    return this.jwtService.sign(data, { secret, expiresIn, });
  }

  public validateToken(_tokenType: Token, _token: string): string | JwtPayload {
    const secret = this.config[_tokenType].secret;

    try {
      return this.jwtService.verify<JwtPayload>(_token, { secret, });
    } catch (e) {
      throw Error('Token invalid');
    }
  }

  async create(file: FileUpload): Promise<FileInfo> {
    const url = new URL('files', this.config.apiUrl);
    const { ...info } = file;
    const logPrefix = `[file-service:${url.href}]`;
    const body = new FormData();

    this.logger.debug(`${logPrefix} Creating`, info);

    if (file.public) {
      body.append('public', String(file.public));
    }

    if (file.data)
      body.append('file', file.data, {
        filename: file.name,
        contentType: file.mime,
      });
    this.logger.debug(`${logPrefix} Creating`, info);
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: info.userId, }), },
    });

    const responseText = await response.text();

    if (!response.ok) {
      this.logger.error(
        `${logPrefix} Failed to create`,
        info,
        'Status:',
        response.status,
        'Response:',
        responseText
      );
      throw new Error(`Failed to create ${file.name} for ${file.userId}`);
    }

    const { result, } = JSON.parse(responseText) as { ok: true; result: FileInfo };
    // const res = await this.request<FileInfo>('POST', `${this.config.apiUrl.toString()}files`, undefined, body, {
    //   Authorization: 'Bearer ' + this.createToken(Token.User, { userId: file.userId, }),
    // });
    this.logger.debug(`${logPrefix} Created`, responseText);

    return result;
  }

  async edit(cred: FileCred, file: FileEdit): Promise<void> {
    const url = this.fileURL(cred.fileId);
    const { ...info } = file;
    const logPrefix = `[file-service:${url.href}]`;

    this.logger.debug(`${logPrefix} Editing`, info);

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(file),
      headers: { 
        Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), 
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      this.logger.error(
        `${logPrefix} Failed to edit`,
        info,
        'Status:',
        response.status,
        'Response:',
        responseText
      );
      throw new Error(`Failed to edit ${file.name} for ${cred.fileId}`);
    }

    const { result, } = JSON.parse(responseText) as FileServicePOSTResponse;

    this.logger.debug(`${logPrefix} Edited`, responseText);
  }

  async get(cred: FileCred): Promise<Buffer> {
    const url = this.fileURL(cred.fileId);
    const logPrefix = `[file-service:${url.href}]`;

    this.logger.debug(`${logPrefix} Downloading`);

    const response = await fetch(url, {
      headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), },
    });

    if (!response.ok) {
      this.logger.error(
        `${logPrefix} Failed to download. Status:`,
        response.status,
        'Response:',
        await response.text()
      );
      throw new Error(`Failed to download file ${url.href}`);
    }

    const buffer = await response.buffer();

    this.logger.debug(`${logPrefix} Downloaded`, buffer.length, 'bytes');

    return buffer;
  }

  async info(cred: FileCred): Promise<FileInfo> {
    const url = this.fileURL(cred.fileId, 'info');
    const logPrefix = `[file-service:${url.href}]`;

    this.logger.debug(`${logPrefix} Get info`);

    const response = await fetch(url, {
      headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), },
    });

    if (!response.ok) {
      this.logger.error(
        `${logPrefix} Failed to get info. Status:`,
        response.status,
        'Response:',
        await response.text()
      );
      throw new Error(`Failed to get info file ${url.href}`);
    }

    const { result: info, } = (await response.json()) as { result: FileInfo };

    this.logger.debug(`${logPrefix} Received`);

    return info;
  }

  async destroy(cred: FileCred): Promise<boolean> {
    const url = this.fileURL(cred.fileId);
    const logPrefix = `[file-service:${url.href}]`;

    this.logger.debug(`${logPrefix} Destroying`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + this.createToken(Token.User, { userId: cred.userId, }), },
    });

    if (!response.ok) {
      this.logger.error(
        `${logPrefix} Failed to destroy. Status:`,
        response.status,
        'Response:',
        await response.text()
      );
      throw new Error(`Failed to destroy file ${url.href}`);
    }

    this.logger.debug(`${logPrefix} Destroyed`);

    return true;
  }
}