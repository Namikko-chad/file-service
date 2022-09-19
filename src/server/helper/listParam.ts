import { Order, Op, WhereOptions, } from 'sequelize';
import { IListParam, } from '../interfaces';

export function listParam(
	query: IListParam,
	fields?: string[],
	intFields?: string[]
): {
  order: Order;
  limit: number;
  offset: number;
  where: WhereOptions;
} {
	const { offset, limit, search, from, to, } = query;
	const order: Order = [];
	if (query.order)
		for (const [key, value] of Object.entries(query.order)) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (key.includes('.'))
				order.push([key.split('.', 1)[0], key.split('.', 2)[1], value]);
			else order.push([key, value]);
		}
	else order.push(['createdAt', 'DESC']);
	const searchFields: WhereOptions[] = [];
	if (search && fields) {
		search.split(' ').forEach((word) => {
			fields.forEach((field) => {
				searchFields.push({
					[field]: {
						[Op.iLike]: `%${decodeURIComponent(word)}%`,
					},
				});
			});
		});
	}

	const maxInt = 2147483647;
	if (search && intFields) {
		if (Number.isInteger(Number(search))) {
			if (Number(search) < maxInt) {
				intFields.forEach((field) => {
					searchFields.push({
						[field]: Number(search),
					});
				});
			}
		}
	}

	const where: WhereOptions = {
		createdAt: {
			[Op.between]: [
				new Date(from).valueOf() || 0,
				new Date(to).setUTCHours(23, 59, 59, 999) || Date.now()
			],
		},
	};
	if (searchFields.length) Object.assign(where, { [Op.or]: searchFields, });

	return { order, limit, offset, where, };
}
