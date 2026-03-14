import { Expression } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";


export class MacroCall implements Expression {
    kind = "MacroCall";

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
