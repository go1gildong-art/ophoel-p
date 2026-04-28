import { Statement, Expression, ASTKind, StandardNode } from "../../ast.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { Location } from "../../location.cjs";
import * as lispify from "./lispify.cjs";
import * as interpret from "./interpret.cjs";


export type CondBodySet = { condition: Expression, body: Expression };

export class IfStatement implements Expression {
    kind = ASTKind.IfStatement;

    constructor(
        public ifSignature: CondBodySet,
        public elifSignatures: CondBodySet[],
        public elseSignature: CondBodySet | undefined,
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.IfStatement(this, ctx); }
    lispify(): string { return lispify.IfStatement(this); }
}

export class WhileStatement implements Statement {
    kind = ASTKind.WhileStatement;

    constructor(
        public condition: Expression,
        public body: Statement,
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.WhileStatement(this, ctx); }
    lispify(): string { return lispify.WhileStatement(this); }
}

export class ForStatement implements Statement {
    kind = ASTKind.ForStatement;

    constructor(
        public declaration: Statement,
        public condition: Expression,
        public increment: Expression,
        public body: Statement,
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.ForStatement(this, ctx); }
    lispify(): string { return lispify.ForStatement(this); }
}

export class ForOfStatement implements Statement {
    kind = ASTKind.ForOfStatement;

    constructor(
        public declaration: Statement,
        public iterable: Expression,
        public body: Statement,
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.ForOfStatement(this, ctx); }
    lispify(): string { return lispify.ForOfStatement(this); }
}

export class RepeatStatement implements Statement {
    kind = ASTKind.RepeatStatement;

    constructor(
        public count: Expression,
        public body: Statement,
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.RepeatStatement(this, ctx); }
    lispify(): string { return lispify.RepeatStatement(this); }
}

export class ChooseStatement implements Statement {
    kind = ASTKind.ChooseStatement;

    constructor(
        public weights: Expression[],
        public bodies: Statement[],
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.ChooseStatement(this, ctx); }
    lispify(): string { return lispify.ChooseStatement(this); }
}

export class ReturnStatement implements Statement {
    kind = ASTKind.ReturnStatement;

    constructor(
        public value: Expression | undefined,
        public location: Location) { }

        async evaluate(ctx: Context): Promise<InterpretReturn> { return await interpret.ReturnStatement(this, ctx); }
    lispify(): string { return lispify.ReturnStatement(this); }
}
