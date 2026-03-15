import { Statement } from "../ast.cjs";
import { Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class ParenExpression implements Expression {
    kind = ASTKind.ParenExpression;

    constructor(
        public expression: Expression,
        public location: Location) {}
}
