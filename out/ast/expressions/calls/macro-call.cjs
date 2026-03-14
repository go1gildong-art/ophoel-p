"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MacroCall = void 0;
class MacroCall {
    constructor(callee, args, location) {
        this.callee = callee;
        this.args = args;
        this.location = location;
        this.kind = "MacroCall";
    }
}
exports.MacroCall = MacroCall;
//# sourceMappingURL=macro-call.cjs.map