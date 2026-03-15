import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export class ChooseStatement implements Statement {
    kind = ASTKind.ChooseStatement;

    constructor(
        public weights: Expression[],
        public bodies: Statement[],
        public location: Location) {}
}
