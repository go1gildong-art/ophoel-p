import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class RepeatStatement implements Statement {
    kind = ASTKind.RepeatStatement;

    constructor(
        public count: Expression,
        public body: Statement,
        public location: Location) {}
}
