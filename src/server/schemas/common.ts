import Joi from 'joi';

export const okSchema = Joi.boolean().example(true).label('Ok');
export const guidSchema = Joi.string().uuid().example('bfed0026-9ddf-4bf2-b941-791ca85040ff').label('guid');

export const tokenSchema = Joi.string().example(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'+
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
);

export const shortDateSchema = Joi.string()
  .regex(/^\w{3}\s\w{3}\s\d{2}\s\d{4}$/)
  .custom((value: string) => {
    return new Date(value).toDateString();
  });

export const pastShortDateSchema = shortDateSchema.custom((value: string, helper) => {
  if (new Date(value) > new Date()) return helper.error('Invalid date');
  if (new Date(value).getFullYear() < 1900) return helper.error('Invalid date');

  return value;
});

export const listSchema = Joi.object({
  limit: Joi.number().min(0).example(0).default(10),
  offset: Joi.number().min(0).example(0).default(0),
  search: Joi.string().max(255).example('example').trim(),
  order: Joi.object({}).pattern(Joi.string(), Joi.string().valid('ASC', 'DESC')),
  from: pastShortDateSchema,
  to: shortDateSchema,
}).custom((value: { from: string; to: string }, helper) => {
  if (new Date(value.from) > new Date(value.to)) return helper.error('Invalid date');

  return value;
});

export function outputEmptySchema(): Joi.Schema {
  return Joi.object({
    ok: okSchema,
  }).label('outputEmptySchema');
}

export function outputOkSchema(res: Joi.Schema): Joi.Schema {
  return Joi.object({
    ok: okSchema,
    result: res,
  }).label('outputOkSchema');
}

export function outputPaginationSchema(res: Joi.Schema): Joi.Schema {
  return Joi.object({
    ok: okSchema,
    result: Joi.object({
      count: Joi.number().integer().example(10),
      rows: Joi.array().items(res),
    }),
  }).label('outputPaginationSchema');
}
