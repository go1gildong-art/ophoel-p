import { Location } from "../compiler/metadata.cjs";
import { Block } from "./block.cjs";
import { ASTNode, Statement, ASTKind } from "./ast.cjs";

export class Program implements ASTNode {
    kind = ASTKind.Program;

    constructor(
        public body: Statement[],
        public location: Location) {}
}
