import { Expression, ASTKind } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";


export class MacroCall implements Expression {
    kind = ASTKind.MacroCall;

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
