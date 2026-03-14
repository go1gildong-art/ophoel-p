"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberAccess = exports.IndexAccess = exports.PostUnary = exports.PreUnary = exports.UnaryOperator = exports.BinaryOperation = exports.BinaryOperator = void 0;
var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator[BinaryOperator["ADD"] = 0] = "ADD";
    BinaryOperator[BinaryOperator["SUBTRACT"] = 1] = "SUBTRACT";
    BinaryOperator[BinaryOperator["MULTIPLY"] = 2] = "MULTIPLY";
    BinaryOperator[BinaryOperator["DIVIDE"] = 3] = "DIVIDE";
    BinaryOperator[BinaryOperator["REMAINDER"] = 4] = "REMAINDER";
    BinaryOperator[BinaryOperator["LOGIC_IS"] = 5] = "LOGIC_IS";
    BinaryOperator[BinaryOperator["LOGIC_IS_NOT"] = 6] = "LOGIC_IS_NOT";
    BinaryOperator[BinaryOperator["LOGIC_AND"] = 7] = "LOGIC_AND";
    BinaryOperator[BinaryOperator["LOGIC_OR"] = 8] = "LOGIC_OR";
    BinaryOperator[BinaryOperator["CMPARE_LARGER"] = 9] = "CMPARE_LARGER";
    BinaryOperator[BinaryOperator["CMPARE_SMALLER"] = 10] = "CMPARE_SMALLER";
    BinaryOperator[BinaryOperator["CMPARE_SLARGER"] = 11] = "CMPARE_SLARGER";
    BinaryOperator[BinaryOperator["CMPARE_SSMALLER"] = 12] = "CMPARE_SSMALLER";
})(BinaryOperator || (exports.BinaryOperator = BinaryOperator = {}));
;
class BinaryOperation {
    constructor(left, operator, right, location) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.location = location;
        this.kind = "BinaryOperation";
    }
}
exports.BinaryOperation = BinaryOperation;
var UnaryOperator;
(function (UnaryOperator) {
    UnaryOperator[UnaryOperator["INCREMENT"] = 0] = "INCREMENT";
    UnaryOperator[UnaryOperator["DECREMENT"] = 1] = "DECREMENT";
    UnaryOperator[UnaryOperator["LOGIC_NOT"] = 2] = "LOGIC_NOT";
})(UnaryOperator || (exports.UnaryOperator = UnaryOperator = {}));
;
class PreUnary {
    constructor(operator, right, location) {
        this.operator = operator;
        this.right = right;
        this.location = location;
        this.kind = "PreUnary";
    }
}
exports.PreUnary = PreUnary;
class PostUnary {
    constructor(operator, left, location) {
        this.operator = operator;
        this.left = left;
        this.location = location;
        this.kind = "PostUnary";
    }
}
exports.PostUnary = PostUnary;
class IndexAccess {
    constructor(left, index, location) {
        this.left = left;
        this.index = index;
        this.location = location;
        this.kind = "IndexAccess";
    }
}
exports.IndexAccess = IndexAccess;
class MemberAccess {
    constructor(left, member, location) {
        this.left = left;
        this.member = member;
        this.location = location;
        this.kind = "MemberAccess";
    }
}
exports.MemberAccess = MemberAccess;
//# sourceMappingURL=operations.cjs.map