import { Statement } from "../ast.cjs";
import { Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class VariableAssign implements Expression {
    kind = ASTKind.VariableAssign;

    constructor(
        public address: Expression,
        public setValue: Expression,
        public location: Location) {}
}
