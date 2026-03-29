import { Location } from "../compiler/metadata.cjs";
import { Block } from "./block.cjs";
import { ASTNode, Statement, ASTKind, StandardNode } from "./ast.cjs";
import { Context, InterpretReturn } from "../compiler/interpreter/utilities.cjs";
import { Lispifier } from "../stringifiers/lispify.cjs";

export class Program implements StandardNode{
    kind = ASTKind.Program;

    constructor(
        public body: Statement[],
        public location: Location) {}

        evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet"}; }
            lispify(): string { return new Lispifier().Program(this); }
}
