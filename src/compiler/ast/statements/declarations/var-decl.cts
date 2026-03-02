import { Statement } from "../../ast.cjs";
import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";
import { OphoelType } from "../../types.cjs";

export class VariableDecl implements Statement {
    kind = "VariableDecl";

    constructor(
        public name: string,
        public variableType: OphoelType,
        public initValue: Expression,
        public location: Location) {}
}
