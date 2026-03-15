import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class ForOfStatement implements Statement {
    kind = ASTKind.ForOfStatement;

    constructor(
        public iterator: string,
        public target: Expression,
        public body: Statement,
        public location: Location) {}
}
