import { Statement, ASTKind } from "./ast.cjs";
import { Location } from "../compiler/metadata.cjs";
import { ASTNode } from "./ast.cjs";

export class Block implements Statement {
    kind = ASTKind.Block;

    constructor(
        public statements: Statement[],
        public location: Location) {}
}
