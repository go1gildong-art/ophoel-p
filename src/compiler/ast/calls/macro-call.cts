import { Expression, Statement } from "../ast.cjs";
import { Location } from "../../metadata.cjs";


export class MacroCall implements Statement implements Expression {
    kind = "MacroCall";

    constructor(
        public callee: string,
        public arguments: Expression[],
        public location: Location) {}
}
