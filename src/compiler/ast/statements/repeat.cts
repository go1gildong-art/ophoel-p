import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { Block } from "../block.cjs";

export class RepeatStatement implements Statement {
    kind = "RepeatStatement";

    constructor(
        public count: Expression,
        public body: Block,
        public location: Location) {}
}
