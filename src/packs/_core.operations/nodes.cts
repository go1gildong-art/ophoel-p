import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";

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

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
            lispify(): string { return lispify.BinaryOperation(this); }
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

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.PreUnary(this); }
}

export class PostUnary implements Expression {
    kind = ASTKind.PostUnary;

    constructor(
        public operator: UnaryOperator,
        public left: Expression,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.PostUnary(this); }
}

export class IndexAccess implements Expression {
    kind = ASTKind.IndexAccess;

    constructor(
        public left: Expression,
        public index: Expression,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.IndexAccess(this); }
}

export class MemberAccess implements Expression {
    kind = ASTKind.MemberAccess;

    constructor(
        public left: Expression,
        public member: string,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.MemberAccess(this); }
}

export class FunctionCall implements Expression {
    kind = ASTKind.FunctionCall;

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.FunctionCall(this); }
}

export class MacroCall implements Expression {
    kind = ASTKind.MacroCall;

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.MacroCall(this); }
}
