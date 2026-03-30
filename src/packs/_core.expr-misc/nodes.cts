import { Expression, ASTKind } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class Identifier implements Expression {
    kind = ASTKind.Identifier;

    constructor(
        public name: string,
        public location: Location) {}
}

export class ParenExpression implements Expression {
    kind = ASTKind.ParenExpression;

    constructor(
        public expression: Expression,
        public location: Location) {}
}

export class VariableAssign implements Expression {
    kind = ASTKind.VariableAssign;

    constructor(
        public address: Expression,
        public setValue: Expression,
        public location: Location) {}
}
