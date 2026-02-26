import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { ASTNode } from "./ast.cjs";

export class Block implements ASTNode {
    kind = "Block";

    constructor(
        public statements: Statement[],
        public location: Location) {}
}
