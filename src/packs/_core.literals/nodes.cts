import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { BinaryOperator } from "../_core.operations/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";

export class BoolLiteral implements Expression {
    kind = ASTKind.BoolLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.BoolLiteral(this, ctx); }
    lispify(): string { return lispify.BoolLiteral(this); }
}

export class CompoundLiteral implements Expression {
    kind = ASTKind.CompoundLiteral;

    constructor(
        public keys: string[],
        public values: Expression[],
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.CompoundLiteral(this, ctx); }
    lispify(): string { return lispify.CompoundLiteral(this); }
}

export class FloatLiteral implements Expression {
    kind = ASTKind.FloatLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.FloatLiteral(this, ctx); }
    lispify(): string { return lispify.FloatLiteral(this); }
}

export class IntLiteral implements Expression {
    kind = ASTKind.IntLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.IntLiteral(this, ctx); }
    lispify(): string { return lispify.IntLiteral(this); }
}

export class StringLiteral implements Expression {
    kind = ASTKind.StringLiteral;

    constructor(
        public raw: string,
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.StringLiteral(this, ctx); }
    lispify(): string { return lispify.StringLiteral(this); }
}

export class TemplateStringLiteral implements Expression {
    kind = ASTKind.TemplateStringLiteral;

    constructor(
        public quasis: string[],
        public expressions: Expression[],
        public raw: string,
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.TemplateStringLiteral(this, ctx); }
    lispify(): string { return lispify.TemplateStringLiteral(this); }
}

export class VectorLiteral implements Expression {
    kind = ASTKind.VectorLiteral;

    constructor(
        public entries: Expression[],
        public location: Location) { }

    async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.VectorLiteral(this, ctx); }
    lispify(): string { return lispify.VectorLiteral(this); }
}
