import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class McExecStatement implements Statement {
    kind = ASTKind.McExecStatement;

    constructor(
        public prefix: Expression,
        public body: Statement,
        public location: Location) {}
}
