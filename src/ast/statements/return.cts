import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class ReturnStatement implements Statement {
    kind = ASTKind.ReturnStatement;

    constructor(
        public value: Expression | null,
        public location: Location) {}
}
