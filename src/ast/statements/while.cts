import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class WhileStatement implements Statement {
    kind = ASTKind.WhileStatement;

    constructor(
        public condition: Expression,
        public body: Statement,
        public location: Location) {}
}
