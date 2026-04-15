import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";
import { FileManager, FileManagerClass } from "../../compiler/file-manager.cjs";

// Expand existing nodes to a pack.
export class Block implements Statement, StandardNode {
    kind = ASTKind.Block;

    constructor(public statements: Statement[], public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.Block(this, ctx); }
    lispify(): string { return lispify.Block(this); }
}

export class ExecExpr implements Statement, StandardNode {
    kind = ASTKind.ExecExpr;

    constructor(public expression: Expression, public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.ExecExpr(this, ctx); }
    lispify(): string { return lispify.ExecExpr(this); }
}


export class Program implements Statement, StandardNode {
    kind = ASTKind.Program;

    constructor(public body: Statement[], public location: Location) { }

    async interpret(fm: FileManagerClass) { return this.evaluate(Context.new(fm)); }
    async interpretPlaceheld(src: string) { return this.evaluate(Context.newPlaceheld(src)) };
    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.Program(this, ctx); }
    lispify(): string { return lispify.Program(this); }
}
