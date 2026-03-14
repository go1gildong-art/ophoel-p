"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundAssign = void 0;
class CompoundAssign {
    constructor(address, operation, setValue, location) {
        this.address = address;
        this.operation = operation;
        this.setValue = setValue;
        this.location = location;
        this.kind = "CompoundAssign";
    }
}
exports.CompoundAssign = CompoundAssign;
//# sourceMappingURL=compound-assign.cjs.map