export class Exception extends Error {
  isException: boolean;
  code: number;
  msg: string;
  data?: Readonly<Record<string, unknown>>;

  constructor(code: number, msg: string, data?: Readonly<Record<string, unknown>>) {
    super(msg);
    this.isException = true;
    this.code = code;
    this.msg = msg;
    if (data) this.data = data;
  }
}
