import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { Block } from "../block.cjs";

export class McExecStatement implements Statement {
    kind = "McExecStatement";

    constructor(
        public prefix: Expression,
        public body: Block,
        public location: Location) {}
}
