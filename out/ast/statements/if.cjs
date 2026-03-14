"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfStatement = void 0;
class IfStatement {
    constructor(ifSignature, elifSignatures, elseSignature, location) {
        this.ifSignature = ifSignature;
        this.elifSignatures = elifSignatures;
        this.elseSignature = elseSignature;
        this.location = location;
        this.kind = "IfStatement";
    }
}
exports.IfStatement = IfStatement;
//# sourceMappingURL=if.cjs.map