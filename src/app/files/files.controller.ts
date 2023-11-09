import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { 
  ApiBearerAuth, 
  ApiBody, 
  ApiConsumes, 
  ApiNotFoundResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiPayloadTooLargeResponse, 
  ApiTags, } from '@nestjs/swagger';
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
import { ListDto, OutputEmptyDto, outputErrorDtoGenerator, outputOkDtoGenerator, outputPaginationDtoGenerator, RequestAuth, } from '../dto';
import { Exception, } from '../utils/Exception';
import { FileEditDto, FileIdDto, FileInfoDto, } from './dto';
import { FileUser, } from './entity';
import { Errors, ErrorsMessages, } from './files.errors';
import { FilePipe, } from './files.pipe';
import { FileService, } from './files.service';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
export class FileController {
  @Inject(FileService)
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
    summary: 'Use this endpoint to list files',
  })
  @ApiOkResponse({
    description: 'List of files',
    type: outputPaginationDtoGenerator(FileInfoDto),
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ 
    type: outputOkDtoGenerator(FileInfoDto),
    description: 'File information',
  })
  @ApiPayloadTooLargeResponse({
    description: 'Payload too large',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async uploadFile(@Req() req: RequestAuth, @UploadedFile(FilePipe) file: Express.Multer.File): Promise<FileInfoDto> {
    const fileUser = await this._service.create(req.user.id, file);

    return FileInfoDto.create(this._service.fileResponse(fileUser));
  }

  @Get(':fileId')
  @ApiOperation({
    summary: 'Use this endpoint to get file',
  })
  @ApiNotFoundResponse({
    type: outputErrorDtoGenerator(FileIdDto, 'File not found'),
    description: 'File not found',
  })
  @AuthTry()
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard, FileAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async retrieveFile(@Req() req: RequestAuth, @Param() params: FileIdDto, @Res({ passthrough: true, }) res: Response): Promise<StreamableFile> {
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
  @ApiOkResponse({ 
    type: outputOkDtoGenerator(FileInfoDto),
    description: 'File information',
  })
  @ApiNotFoundResponse({
    type: outputErrorDtoGenerator(FileIdDto, 'File not found'),
    description: 'File not found',
  })
  @AuthTry()
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard, FileAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async retrieveInfo(@Req() req: RequestAuth, @Param() params: FileIdDto): Promise<FileInfoDto> {
    const fileUser = await this._service.retrieveInfo(params.fileId);

    this.viewAccess(req, fileUser);

    return FileInfoDto.create(this._service.fileResponse(fileUser));
  }

  @Put(':fileId')
  @ApiOperation({
    summary: 'Use this endpoint to upload new filename or public status',
  })
  @ApiOkResponse({ 
    type: outputOkDtoGenerator(FileInfoDto),
    description: 'File information',
  })
  @ApiNotFoundResponse({
    type: outputErrorDtoGenerator(FileIdDto, 'File not found'),
    description: 'File not found',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
  async fileEdit(@Req() req: RequestAuth, @Param() params: FileIdDto, @Body() payload: FileEditDto): Promise<FileInfoDto> {
    let fileUser = await this._service.retrieveInfo(params.fileId);

    this.editAccess(req, fileUser);
    fileUser = await this._service.update(params.fileId, payload);

    return FileInfoDto.create(this._service.fileResponse(fileUser));
  }

  @Delete(':fileId')
  @ApiOperation({
    summary: 'Use this endpoint to delete file',
  })
  @ApiOkResponse({ 
    type: OutputEmptyDto,
    description: 'Empty response',
  })
  @ApiNotFoundResponse({
    type: outputErrorDtoGenerator(FileIdDto, 'File not found'),
    description: 'File not found',
  })
  @MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard)
  @UseGuards(MultipleAuthorizeGuard)
  async fileDelete(@Req() req: RequestAuth, @Param() params: FileIdDto): Promise<void> {
    const fileUser = await this._service.retrieveInfo(params.fileId);

    this.editAccess(req, fileUser);
    await this._service.delete(params.fileId);
  }
}
