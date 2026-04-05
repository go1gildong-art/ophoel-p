import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";

export class Include implements Statement {
    kind = ASTKind.Include;
    constructor(public path: string, public location: Location) {}

    evaluate(ctx: Context): InterpretReturn { return interpret.Include(this, ctx); }
    lispify(): string { return lispify.Include(this); }
}

