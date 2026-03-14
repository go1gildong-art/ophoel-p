"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MacroDecl = void 0;
class MacroDecl {
    constructor(name, parameters, body, location) {
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.location = location;
        this.kind = "MacroDecl";
    }
}
exports.MacroDecl = MacroDecl;
//# sourceMappingURL=macro-decl.cjs.map