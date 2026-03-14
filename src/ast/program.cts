import { Location } from "../compiler/metadata.cjs";
import { Block } from "./block.cjs";
import { ASTNode, Statement } from "./ast.cjs";

export class Program implements ASTNode {
    kind = "Program";

    constructor(
        public body: Statement[],
        public location: Location) {}
}
