import { Statement, Expression, ASTKind } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export type CondBodySet = { condition: Expression, body: Statement };

export class IfStatement implements Statement {
    kind = ASTKind.IfStatement;

    constructor(
        public ifSignature: CondBodySet,
        public elifSignatures: CondBodySet[],
        public elseSignature: CondBodySet | undefined,
        public location: Location) { }
}

export class WhileStatement implements Statement {
    kind = ASTKind.WhileStatement;

    constructor(
        public condition: Expression,
        public body: Statement,
        public location: Location) { }
}

export class ForStatement implements Statement {
    kind = ASTKind.ForStatement;

    constructor(
        public declaration: Statement,
        public condition: Expression,
        public increment: Expression,
        public body: Statement,
        public location: Location) { }
}

export class ForOfStatement implements Statement {
    kind = ASTKind.ForOfStatement;

    constructor(
        public declaration: Statement,
        public iterable: Expression,
        public body: Statement,
        public location: Location) { }
}

export class RepeatStatement implements Statement {
    kind = ASTKind.RepeatStatement;

    constructor(
        public count: Expression,
        public body: Statement,
        public location: Location) { }
}

export class ChooseStatement implements Statement {
    kind = ASTKind.ChooseStatement;

    constructor(
        public weights: Expression[],
        public bodies: Statement[],
        public location: Location) { }
}

export class ReturnStatement implements Statement {
    kind = ASTKind.ReturnStatement;

    constructor(
        public value: Expression | undefined,
        public location: Location) { }
}
