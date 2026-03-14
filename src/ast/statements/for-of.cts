import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { Block } from "../block.cjs";

export class ForOfStatement implements Statement {
    kind = "ForOfStatement";

    constructor(
        public iterator: string,
        public target: Expression,
        public body: Block,
        public location: Location) {}
}
