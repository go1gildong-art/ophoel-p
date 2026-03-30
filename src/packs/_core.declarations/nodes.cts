import { Statement, Expression, ASTKind, StandardNode } from "../../ast/ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../compiler/metadata.cjs";
import * as lispify from "./lispify.cjs";

export class ConstDecl implements Statement, StandardNode {
    kind = ASTKind.ConstDecl;

    constructor(
        public name: string,
        public initValue: Expression,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.ConstDecl(this); }
}

export class FunctionDecl implements Statement, StandardNode {
    kind = ASTKind.FunctionDecl;

    constructor(
        public name: string,
        public parameters: string[],
        public body: Block,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.FunctionDecl(this); }
}

export class MacroDecl implements Statement, StandardNode {
    kind = ASTKind.MacroDecl;

    constructor(
        public name: string,
        public parameters: string[],
        public body: Block,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.MacroDecl(this); }
}

export class VariableDecl implements Statement, StandardNode {
    kind = ASTKind.VariableDecl;

    constructor(
        public name: string,
        public initValue: Expression,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.VariableDecl(this); }
}
