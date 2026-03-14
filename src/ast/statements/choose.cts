import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { Block } from "../block.cjs";

export class ChooseStatement implements Statement {
    kind = "ChooseStatement";

    constructor(
        public weights: Expression[],
        public bodies: Block[],
        public location: Location) {}
}
