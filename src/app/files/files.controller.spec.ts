// import { describe, beforeEach, it, expect } from '@jest/globals';
// import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { FileController } from './files.controller';
// import { FileRepository, FileUserRepository } from './repositories';
// import { DatabaseModule } from '../database/database.module';
// import { FileService } from './files.service';
// import { Utils } from '../utils/utils';
// import { Request } from 'express';

// describe('UsersController', () => {
//   let app: TestingModule;
//   let controller: FileController;
//   // let fileUserRepository: FileUserRepository;
//   // let fileRepository: FileRepository;

//   beforeEach(async () => {
//     app = await Test.createTestingModule({
//       imports: [DatabaseModule, TypeOrmModule.forFeature([FileRepository, FileUserRepository])],
//       controllers: [FileController],
//       providers: [FileService],
//     }).compile();

//     controller = app.get<FileController>(FileController);
//     // fileUserRepository = app.get<FileUserRepository>(FileUserRepository);
//     // fileRepository = app.get<FileRepository>(FileRepository);
//   });

//   describe('root', () => {
//     it('should create file', async () => {
//       // @ts-ignore
//       const list = await controller.list(
//         {
//           user: {
//             id: Utils.getUUID(),
//           },
//         } as Request,
//         {},
//       );
//       expect(list.count).toBe(0);
//     });
//   });
// });
