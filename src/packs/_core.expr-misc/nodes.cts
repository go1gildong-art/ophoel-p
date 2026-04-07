import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";
export class Identifier implements Expression {
    kind = ASTKind.Identifier;

    constructor(
        public name: string,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return interpret.Identifier(this, ctx); }
    lispify(): string { return lispify.Identifier(this); }
}

export class ParenExpression implements Expression {
    kind = ASTKind.ParenExpression;

    constructor(
        public expression: Expression,
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return interpret.ParenExpression(this, ctx); }
    lispify(): string { return lispify.ParenExpression(this); }
}

