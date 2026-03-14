import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";
import { Block } from "../block.cjs";

export type CondBodySet = { condition: Expression, body: Block }
export class IfStatement implements Statement {
    kind = "IfStatement";

    constructor(
        public ifSignature: CondBodySet,
        public elifSignatures: CondBodySet[],
        public elseSignature: CondBodySet | undefined,
        public location: Location) { }
}
