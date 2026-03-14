import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class ForStatement implements Statement {
    kind = "ForStatement";

    constructor(
        public declaration: Statement,
        public condition: Expression,
        public increment: Statement,
        public body: Block,
        public location: Location) {}
}
