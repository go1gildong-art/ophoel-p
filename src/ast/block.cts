import { Statement, ASTKind, StandardNode } from "./ast.cjs";
import { Location } from "../compiler/metadata.cjs";
import { ASTNode } from "./ast.cjs";
import { Context, InterpretReturn } from "../compiler/interpreter/utilities.cjs";
import { Lispifier } from "../stringifiers/lispify.cjs";

export class Block implements Statement, StandardNode {
    kind = ASTKind.Block;

    constructor(
        public statements: Statement[],
        public location: Location) {}

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet"}; }
    lispify(): string { return new Lispifier().Block(this); }
}
