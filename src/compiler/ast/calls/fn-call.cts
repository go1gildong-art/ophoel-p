import { Expression, Statement } from "../ast.cjs";
import { Location } from "../../metadata.cjs";


export class FunctionCall implements Statement implements Expression {
    kind = "FunctionCall";

    constructor(
        public callee: string,
        public arguments: Expression[],
        public location: Location) {}
}
