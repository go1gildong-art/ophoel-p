import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";

export class Include implements Statement {
    kind = ASTKind.Include;
    constructor(public path: string, public location: Location) {}

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
        lispify(): string { return lispify.Include(this); }
}

