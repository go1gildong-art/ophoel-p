import { Statement, Expression, ASTKind, StandardNode } from "../../ast/ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { BinaryOperator } from "../_core.operations/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../compiler/metadata.cjs";
import * as lispify from "./lispify.cjs";

export class BoolLiteral implements Expression {
    kind = ASTKind.BoolLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.BoolLiteral(this); }
}

export class CompoundLiteral implements Expression {
    kind = ASTKind.CompoundLiteral;

    constructor(
        public keys: string[],
        public values: Expression[],
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.CompoundLiteral(this); }
}

export class FloatLiteral implements Expression {
    kind = ASTKind.FloatLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.FloatLiteral(this); }
}

export class IntLiteral implements Expression {
    kind = ASTKind.IntLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.IntLiteral(this); }
}

export class StringLiteral implements Expression {
    kind = ASTKind.StringLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.StringLiteral(this); }
}

export class TemplateStringLiteral implements Expression {
    kind = ASTKind.TemplateStringLiteral;

    constructor(
        public quasis: string[],
        public expressions: Expression[],
        public raw: string,
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.TemplateStringLiteral(this); }
}

export class VectorLiteral implements Expression {
    kind = ASTKind.VectorLiteral;

    constructor(
        public entries: Expression[],
        public location: Location) { }

    evaluate(ctx: Context): InterpretReturn { return { ok: false, err: "not implemented yet" }; }
    lispify(): string { return lispify.VectorLiteral(this); }
}
