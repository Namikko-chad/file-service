import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';
import { Express, Response, } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer, } from 'multer';

import { AuthTry, } from '../auth/auth.decorators';
import { AdminAccessGuard, } from '../auth/guards/admin.guard';
import { FileAccessGuard, } from '../auth/guards/file.guard';
import { MultipleAuthorizeGuard, MultipleGuardsReferences, } from '../auth/guards/multiple.guard';
import { UserAccessGuard, } from '../auth/guards/user.guard';
import { ListDto, } from '../dto';
import { RequestAuth, } from '../dto/common.dto';
import { Exception, } from '../utils/Exception';
import { FileEditDto, FileInfoDto, } from './dto';
import { FileUser, } from './entity';
import { FileService, } from './files.service';

class QueryDTO {
  fileId: string;
}

enum Errors {
  FileIsPrivate = 403001,
  UserNotFound = 404001,
  FileNotFound = 404002,
}

const ErrorsMessages: Record<Errors, string> = {
  [Errors.FileIsPrivate]: 'File: Private',
  [Errors.FileNotFound]: 'File: Not found',
  [Errors.UserNotFound]: 'User: Not found',
};

@ApiTags('files')
@Controller('files')
export class FileController {
  private readonly _service: FileService;

  private editAccess(req: RequestAuth, file: FileUser): void {
    const user = req.user;

    if (file.userId !== user?.id && !(req.artifacts.guard instanceof AdminAccessGuard))
      throw new Exception(Errors.FileIsPrivate, ErrorsMessages[Errors.FileIsPrivate]);
  }

  private viewAccess(req: RequestAuth, file: FileUser): void {
    if (!file.public) {
      if (!req.user) throw new Exception(Errors.FileIsPrivate, ErrorsMessages[Errors.FileIsPrivate]);
      const user = req.user;

      switch (req.artifacts.guard.constructor) {
        case UserAccessGuard:
          if (file.userId !== user?.id) throw new Exception(Errors.FileIsPrivate, ErrorsMessages[Errors.FileIsPrivate]);
          break;
        case FileAccessGuard:
          if (file.id !== req.fileId) throw new Exception(Errors.FileIsPrivate, ErrorsMessages[Errors.FileIsPrivate]);
      }
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Use this endpoint to list file',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
  async list(@Req() req: RequestAuth, @Query() listParam: ListDto<FileUser>): Promise<{ count: number; rows: FileInfoDto[] }> {
    const [files, count] = await this._service.list(req.user.id, listParam);

    return { count, rows: files.map((file) => this._service.fileResponse(file)), };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Use this endpoint to upload file',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async uploadFile(@Req() req: RequestAuth, @UploadedFile() file: Express.Multer.File): Promise<FileInfoDto> {
    const fileUser = await this._service.create(req.user.id, file);

    return this._service.fileResponse(fileUser);
  }

  @Get(':fileId')
  @ApiOperation({
    summary: 'Use this endpoint to get file',
  })
  @AuthTry()
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard, FileAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async retrieveFile(@Req() req: RequestAuth, @Param() params: QueryDTO, @Res({ passthrough: true, }) res: Response): Promise<StreamableFile> {
    const [fileUser, data] = await this._service.retrieve(params.fileId);

    this.viewAccess(req, fileUser);
    res.set({
      'Content-Type': fileUser.file.mime,
      'Content-Length': fileUser.file.size,
      'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(fileUser.name + '.' + fileUser.file.ext),
    });

    return new StreamableFile(data);
  }

  @Get(':fileId/info')
  @ApiOperation({
    summary: 'Use this endpoint to get information about file',
  })
  @AuthTry()
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard, FileAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async retrieveInfo(@Req() req: RequestAuth, @Param() params: QueryDTO): Promise<FileInfoDto> {
    const fileUser = await this._service.retrieveInfo(params.fileId);

    this.viewAccess(req, fileUser);

    return this._service.fileResponse(fileUser);
  }

  @Put(':fileId')
  @ApiOperation({
    summary: 'Use this endpoint to upload new filename or public status',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
  async fileEdit(@Req() req: RequestAuth, @Param() params: QueryDTO, @Body() payload: FileEditDto): Promise<FileInfoDto> {
    let fileUser = await this._service.retrieveInfo(params.fileId);

    this.editAccess(req, fileUser);
    fileUser = await this._service.update(params.fileId, payload);

    return this._service.fileResponse(fileUser);
  }

  @Delete(':fileId')
  @ApiOperation({
    summary: 'Use this endpoint to delete file',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async fileDelete(@Req() req: RequestAuth, @Param() params: QueryDTO): Promise<void> {
    const fileUser = await this._service.retrieveInfo(params.fileId);

    this.editAccess(req, fileUser);
    await this._service.delete(params.fileId);
  }
}
