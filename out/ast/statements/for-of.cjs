"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForOfStatement = void 0;
class ForOfStatement {
    constructor(iterator, target, body, location) {
        this.iterator = iterator;
        this.target = target;
        this.body = body;
        this.location = location;
        this.kind = "ForOfStatement";
    }
}
exports.ForOfStatement = ForOfStatement;
//# sourceMappingURL=for-of.cjs.map