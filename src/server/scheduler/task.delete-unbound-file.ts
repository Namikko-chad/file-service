import { literal, Op,Transaction, } from 'sequelize';

import { File, FileUser, } from '../files';
import { AbstractTask, } from './abstract-task';

export class DeleteUnboundFileTask extends AbstractTask {
  interval = '0 0 * * *';

  handler = async (transaction?: Transaction): Promise<void> => {
    const unboundFiles = await File.findAll({
      attributes: ['id'],
      include: [
        {
          model: FileUser,
          attributes: [],
          required: false,
        }
      ],
      where: {
        [Op.and]: literal('"fileUsers"."fileId" IS NULL'),
      },
      transaction,
    });
    await Promise.all(unboundFiles.map((file) => this.server.app.storage.deleteFile(file.id)));
  };
}
