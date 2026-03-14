import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { BinaryOperator } from "../expressions/operations.cjs";

export class CompoundAssign implements Expression {
    kind = "CompoundAssign";

    constructor(
        public address: Expression,
        public operation: BinaryOperator,
        public setValue: Expression,
        public location: Location) {}
}
