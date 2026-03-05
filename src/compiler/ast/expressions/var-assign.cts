import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class VariableAssign implements Expression {
    kind = "VariableAssign";

    constructor(
        public address: Expression,
        public setValue: Expression,
        public location: Location) {}
}
