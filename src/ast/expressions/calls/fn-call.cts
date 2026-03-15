import { Expression, ASTKind } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";


export class FunctionCall implements Expression {
    kind = ASTKind.FunctionCall;

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
