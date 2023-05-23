import { Options as BoomOptions, } from '@hapi/boom';
import { RequestQuery, } from '@hapi/hapi';

export interface IOutputEmpty {
  ok: boolean;
}

export interface IOutputOk<R = Record<string, string>> {
  ok: boolean;
  result: R;
}

export interface IOutputPagination<R = Record<string, string>> {
  ok: boolean;
  result: {
    count: number[] | number;
    rows: R;
  };
}

export interface IBoomData<T = Record<string, unknown>> extends BoomOptions<T> {
  code: number;
  api: boolean;
  data: T;
}

export interface IListParam extends RequestQuery {
  offset: number;
  limit: number;
  search: string;
  order: string[];
  from: number;
  to: number;
}
