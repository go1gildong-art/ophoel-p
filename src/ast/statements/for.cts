import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class ForStatement implements Statement {
    kind = ASTKind.ForStatement;

    constructor(
        public declaration: Statement,
        public condition: Expression,
        public increment: Statement,
        public body: Statement,
        public location: Location) {}
}
