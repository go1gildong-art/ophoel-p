import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class ChooseStatement implements Statement {
    kind = "ChooseStatement";

    constructor(
        public weights: Expression[],
        public bodies: Statement[],
        public location: Location) {}
}
