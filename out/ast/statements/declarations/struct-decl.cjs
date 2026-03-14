"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructDecl = void 0;
class StructDecl {
    constructor(name, fields, location) {
        this.name = name;
        this.fields = fields;
        this.location = location;
        this.kind = "StructDecl";
    }
}
exports.StructDecl = StructDecl;
//# sourceMappingURL=struct-decl.cjs.map