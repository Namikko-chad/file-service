import { v4 as uuidv4, } from 'uuid';

// import { ListDto, } from '../dto';

export class Utils {
  static getUUID(): string {
    return uuidv4();
  }

  static async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // static listParam<Entity>(query: ListDto<Entity>, fields?: string[], intFields?: string[]): FindManyOptions<Entity> {
  //   const { offset: skip, limit: take, search, from, to, order, } = query;

  //   const searchFields: FindOptionsWhere<unknown>[] = [];

  //   if (search && fields) {
  //     search.split(' ').forEach((word) => {
  //       fields.forEach((field) => {
  //         searchFields.push({
  //           [field]: ILike(`%${decodeURIComponent(word)}%`),
  //         });
  //       });
  //     });
  //   }

  //   const maxInt = 2147483647;

  //   if (search && intFields) {
  //     if (Number.isInteger(Number(search))) {
  //       if (Number(search) < maxInt) {
  //         intFields.forEach((field) => {
  //           searchFields.push({
  //             [field]: Number(search),
  //           });
  //         });
  //       }
  //     }
  //   }

  //   const createdAt = Between(from, to);
  //   const where: FindOptionsWhere<unknown> = {
  //     createdAt,
  //   };
  //   if (searchFields.length) searchFields.forEach( field => Object.assign(where, field) );

  //   return {
  //     where,
  //     // TODO check property name in order on UPCASE letter
  //     order,
  //     take,
  //     skip,
  //   };
  // }
}
