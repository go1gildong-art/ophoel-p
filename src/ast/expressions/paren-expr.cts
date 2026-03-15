import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class ParenExpression implements Expression {
    kind = "ParenExpression";

    constructor(
        public expression: Expression,
        public location: Location) {}
}
