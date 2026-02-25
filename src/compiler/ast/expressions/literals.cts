import { ASTNode, Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class BoolLiteral implements Expression {
    kind = "BoolLiteral";

    constructor(
        public raw: string,
        public location: Location) {}
}

export class CompoundLiteral implements Expression {
    kind = "CompoundLiteral";

    constructor(
        public keys: string[], 
        public values: Expression[], 
        public location: Location) {}
}

export class FloatLiteral implements Expression {
    kind = "FloatLiteral";

    constructor(
        public raw: string,
        public location: Location) {}
}

export class IntLiteral implements Expression {
    kind = "IntLiteral";

    constructor(
        public raw: string,
        public location: Location) {}
}

export class StringLiteral implements Expression {
    kind = "StringLiteral";

    constructor(
        public raw: string,
        public location: Location) {}
}

export class TemplateStringLiteral implements Expression {
    kind = "TemplateStringLiteral";
    
    constructor(
        public quasis: string[],
        public expressions: Expression[],
        public location: Location) {}
}

export class VectorLiteral implements Expression {
    kind = "VectorLiteral";

    constructor(
        public entries: ASTNode[],
        public location: Location) {}
}