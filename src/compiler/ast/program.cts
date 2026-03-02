import { Location } from "../metadata.cjs";
import { Block } from "./block.cjs";
import { ASTNode } from "./ast.cjs";

export class Program implements ASTNode {
    kind = "Program";

    constructor(
        public body: Block,
        public location: Location) {}
}
