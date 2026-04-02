import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { BinaryOperator } from "../_core.operations/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
export class Identifier implements Expression {
    kind = ASTKind.Identifier;

    constructor(
        public name: string,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
            lispify(): string { return lispify.Identifier(this); }
}

export class ParenExpression implements Expression {
    kind = ASTKind.ParenExpression;

    constructor(
        public expression: Expression,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
            lispify(): string { return lispify.ParenExpression(this); }
}

export class VariableAssign implements Expression {
    kind = ASTKind.VariableAssign;

    constructor(
        public address: Expression,
        public setValue: Expression,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
            lispify(): string { return lispify.VariableAssign(this); }
}

export class CompoundAssign implements Expression {
    kind = ASTKind.CompoundAssign;

    constructor(
        public address: Expression,
        public operation: BinaryOperator,
        public setValue: Expression,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
            lispify(): string { return lispify.CompoundAssign(this); }
}