import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";


export class FunctionCall implements Expression {
    kind = "FunctionCall";

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
