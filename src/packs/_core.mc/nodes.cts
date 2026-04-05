import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";

export class McCommand implements Statement {
    kind = ASTKind.McCommand;

    constructor(public command: string, public argument: Expression, public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return interpret.McCommand(this, ctx); }
    lispify(): string { return lispify.McCommand(this); }
}

export class McExecStatement implements Statement {
    kind = ASTKind.McExecStatement;

    constructor(public prefix: Expression, public body: Statement, public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return interpret.McExecStatement(this, ctx); }
    lispify(): string { return lispify.McExecStatement(this); }
}
