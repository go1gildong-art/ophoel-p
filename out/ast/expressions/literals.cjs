"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorLiteral = exports.TemplateStringLiteral = exports.StringLiteral = exports.IntLiteral = exports.FloatLiteral = exports.CompoundLiteral = exports.BoolLiteral = void 0;
class BoolLiteral {
    constructor(raw, location) {
        this.raw = raw;
        this.location = location;
        this.kind = "BoolLiteral";
    }
}
exports.BoolLiteral = BoolLiteral;
class CompoundLiteral {
    constructor(keys, values, location) {
        this.keys = keys;
        this.values = values;
        this.location = location;
        this.kind = "CompoundLiteral";
    }
}
exports.CompoundLiteral = CompoundLiteral;
class FloatLiteral {
    constructor(raw, location) {
        this.raw = raw;
        this.location = location;
        this.kind = "FloatLiteral";
    }
}
exports.FloatLiteral = FloatLiteral;
class IntLiteral {
    constructor(raw, location) {
        this.raw = raw;
        this.location = location;
        this.kind = "IntLiteral";
    }
}
exports.IntLiteral = IntLiteral;
class StringLiteral {
    constructor(raw, location) {
        this.raw = raw;
        this.location = location;
        this.kind = "StringLiteral";
    }
}
exports.StringLiteral = StringLiteral;
class TemplateStringLiteral {
    constructor(quasis, expressions, location) {
        this.quasis = quasis;
        this.expressions = expressions;
        this.location = location;
        this.kind = "TemplateStringLiteral";
    }
}
exports.TemplateStringLiteral = TemplateStringLiteral;
class VectorLiteral {
    constructor(entries, location) {
        this.entries = entries;
        this.location = location;
        this.kind = "VectorLiteral";
    }
}
exports.VectorLiteral = VectorLiteral;
//# sourceMappingURL=literals.cjs.map