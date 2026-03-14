"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableDecl = void 0;
class VariableDecl {
    constructor(name, mutability, initValue, location) {
        this.name = name;
        this.mutability = mutability;
        this.initValue = initValue;
        this.location = location;
        this.kind = "VariableDecl";
    }
}
exports.VariableDecl = VariableDecl;
//# sourceMappingURL=var-decl.cjs.map