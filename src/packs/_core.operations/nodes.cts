import { Expression, LValue, ASTKind } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export enum BinaryOperator {
    ADD = "+",
    SUBTRACT = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    REMAINDER = "%",

    LOGIC_IS = "==",
    LOGIC_IS_NOT = "!=",
    LOGIC_AND = "&&",
    LOGIC_OR = "||",

    CMPARE_LARGER = ">",
    CMPARE_SMALLER = "<",
    CMPARE_SLARGER = ">=",
    CMPARE_SSMALLER = "<="
};

export class BinaryOperation implements Expression {
    kind = ASTKind.BinaryOperation;

    constructor(
        public left: Expression,
        public operator: BinaryOperator,
        public right: Expression,
        public location: Location) {}
}

export enum UnaryOperator {
    INCREMENT = "++",
    DECREMENT = "--",
    LOGIC_NOT = "!"
};

export class PreUnary implements Expression {
    kind = ASTKind.PreUnary;

    constructor(
        public operator: UnaryOperator,
        public right: Expression,
        public location: Location) {}
}

export class PostUnary implements Expression {
    kind = ASTKind.PostUnary;

    constructor(
        public operator: UnaryOperator,
        public left: Expression,
        public location: Location) {}
}

export class IndexAccess implements LValue {
    kind = ASTKind.IndexAccess;

    constructor(
        public left: Expression,
        public index: Expression,
        public location: Location) {}
}

export class MemberAccess implements LValue {
    kind = ASTKind.MemberAccess;

    constructor(
        public left: Expression,
        public member: string,
        public location: Location) {}
}

export class FunctionCall implements Expression {
    kind = ASTKind.FunctionCall;

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}

export class MacroCall implements Expression {
    kind = ASTKind.MacroCall;

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
