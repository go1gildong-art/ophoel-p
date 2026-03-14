"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionDecl = void 0;
class FunctionDecl {
    constructor(name, parameters, body, location) {
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.location = location;
        this.kind = "FunctionDecl";
    }
}
exports.FunctionDecl = FunctionDecl;
//# sourceMappingURL=fn-decl.cjs.map