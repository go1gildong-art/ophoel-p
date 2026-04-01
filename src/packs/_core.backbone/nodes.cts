import { Statement, Expression, ASTKind, StandardNode } from "../../ast/ast.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../compiler/metadata.cjs";
import * as lispify from "./lispify.cjs";

// Expand existing nodes to a pack.
export class Block implements Statement, StandardNode {
    kind = ASTKind.Block;

    constructor(public statements: Statement[], public location: Location) {}

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
        lispify(): string { return lispify.Block(this); }
}

export class ExecExpr implements Statement, StandardNode {
    kind = ASTKind.ExecExpr;

    constructor(public expression: Expression, public location: Location) {}

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
        lispify(): string { return lispify.ExecExpr(this); }
}


export class Program implements Statement, StandardNode {
    kind = ASTKind.Program;

    constructor(public body: Statement[], public location: Location) {}

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
        lispify(): string { return lispify.Program(this); }
}
