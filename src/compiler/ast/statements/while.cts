import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { Block } from "../block.cjs";

export class WhileStatement implements Statement {
    kind = "WhileStatement";

    constructor(
        public condition: Expression,
        public body: Block,
        public location: Location) {}
}
