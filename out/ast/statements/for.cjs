"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForStatement = void 0;
class ForStatement {
    constructor(declaration, condition, increment, body, location) {
        this.declaration = declaration;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
        this.location = location;
        this.kind = "ForStatement";
    }
}
exports.ForStatement = ForStatement;
//# sourceMappingURL=for.cjs.map