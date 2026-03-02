import { Expression, Statement } from "../ast.cjs";
import { Location } from "../../metadata.cjs";


export class MacroCall implements Statement, Expression {
    kind = "MacroCall";

    constructor(
        public callee: string,
        public args: Expression[],
        public location: Location) {}
}
