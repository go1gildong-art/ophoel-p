"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCall = void 0;
class FunctionCall {
    constructor(callee, args, location) {
        this.callee = callee;
        this.args = args;
        this.location = location;
        this.kind = "FunctionCall";
    }
}
exports.FunctionCall = FunctionCall;
//# sourceMappingURL=fn-call.cjs.map