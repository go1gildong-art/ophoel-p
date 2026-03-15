import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class ExecuteExpression implements Statement {
    kind = ASTKind.ExecuteExpression;

    constructor(
        public expression: Expression,
        public location: Location) {}
}
