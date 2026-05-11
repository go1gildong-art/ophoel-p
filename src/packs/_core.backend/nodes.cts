import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";
import { FileManager, FileManagerClass } from "../../compiler/file-manager.cjs";

// Expand existing nodes to a pack.
export class Print implements Statement, StandardNode {
    kind = ASTKind.Print

    constructor(
        public content: Expression,
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.Print(this, ctx); }
    lispify(): string { return lispify.Print(this); }
}
