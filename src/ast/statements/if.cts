import { Statement, Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export type CondBodySet = { condition: Expression, body: Statement }
export class IfStatement implements Statement {
    kind = ASTKind.IfStatement;

    constructor(
        public ifSignature: CondBodySet,
        public elifSignatures: CondBodySet[],
        public elseSignature: CondBodySet | undefined,
        public location: Location) { }
}
