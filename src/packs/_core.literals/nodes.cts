import { Expression, ASTKind } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class BoolLiteral implements Expression {
    kind = ASTKind.BoolLiteral;

    constructor(
        public raw: string,
        public location: Location) { }
}

export class CompoundLiteral implements Expression {
    kind = ASTKind.CompoundLiteral;

    constructor(
        public keys: string[],
        public values: Expression[],
        public location: Location) { }
}

export class FloatLiteral implements Expression {
    kind = ASTKind.FloatLiteral;

    constructor(
        public raw: string,
        public location: Location) { }
}

export class IntLiteral implements Expression {
    kind = ASTKind.IntLiteral;

    constructor(
        public raw: string,
        public location: Location) { }
}

export class StringLiteral implements Expression {
    kind = ASTKind.StringLiteral;

    constructor(
        public raw: string,
        public location: Location) { }
}

export class TemplateStringLiteral implements Expression {
    kind = ASTKind.TemplateStringLiteral;

    constructor(
        public quasis: string[],
        public expressions: Expression[],
        public raw: string,
        public location: Location) { }
}

export class VectorLiteral implements Expression {
    kind = ASTKind.VectorLiteral;

    constructor(
        public entries: Expression[],
        public location: Location) { }
}
