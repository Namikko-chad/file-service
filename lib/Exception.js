"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const common_1 = require("@nestjs/common");
class Exception extends common_1.HttpException {
    code;
    msg;
    data;
    constructor(code, msg, data, options) {
        super(msg, code, options);
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=Exception.js.map