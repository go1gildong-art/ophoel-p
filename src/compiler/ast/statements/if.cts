import { Statement } from "../ast.cjs";
import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";
import { Block } from "../block.cjs";

export class IfStatement implements Statement {
    kind = "IfStatement";

    constructor(
        public conditions: Expression[],
        public bodies: Block[],
        public elseBody: Block | undefined,
        public location: Location) {}
}
