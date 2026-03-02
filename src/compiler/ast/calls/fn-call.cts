import { Expression, Statement } from "../ast.cjs";
import { Location } from "../../metadata.cjs";


export class FunctionCall implements Statement, Expression {
    kind = "FunctionCall";

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
