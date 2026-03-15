import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { BinaryOperator } from "../expressions/operations.cjs";

export class CompoundAssign implements Expression {
    kind = ASTKind.CompoundAssign;

    constructor(
        public address: Expression,
        public operation: BinaryOperator,
        public setValue: Expression,
        public location: Location) {}
}
