import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class ExecuteExpression implements Statement {
    kind = "ExecuteExpression";

    constructor(
        public expression: Expression,
        public location: Location) {}
}
