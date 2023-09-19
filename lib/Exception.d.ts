import { HttpException, HttpExceptionOptions } from '@nestjs/common';
export declare class Exception extends HttpException {
    code: number;
    msg: string;
    data?: Readonly<Record<string, unknown>>;
    constructor(code: number, msg: string, data?: Readonly<Record<string, unknown>>, options?: HttpExceptionOptions);
}
//# sourceMappingURL=Exception.d.ts.map