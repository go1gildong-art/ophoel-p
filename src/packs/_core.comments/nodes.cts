import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";

export class SLComment implements Statement, StandardNode {
    kind = ASTKind.SLComment;

    constructor(public content: string, public location: Location) { }
    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.SLComment(this, ctx); }
    lispify(): string { return lispify.SLComment(this); }
}

export class MLComment implements Statement, StandardNode {
    kind = ASTKind.MLComment;

    constructor(public content: string, public location: Location) { }
    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.MLComment(this, ctx); }
    lispify(): string { return lispify.MLComment(this); }
}

export class PreservedComment implements Statement, StandardNode {
    kind = ASTKind.PreservedComment;

    constructor(public content: string, public location: Location) { }
    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.PreservedComment(this, ctx); }
    lispify(): string { return lispify.PreservedComment(this); }
}

export class PreservedNewline implements Statement, StandardNode {
    kind = ASTKind.PreservedNewline;

    constructor(public location: Location) { }
    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.PreservedNewline(this, ctx); }
    lispify(): string { return lispify.PreservedNewline(this); }
}
