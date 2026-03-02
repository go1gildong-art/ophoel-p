import { Statement } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";
import { OphoelType } from "../../types.cjs";
import { Block } from "../../block.cjs";

export class FunctionDecl implements Statement {
    kind = "FunctionDecl";

    constructor(
        public name: string,
        public parameters: { name: string, type: OphoelType }[],
        public returnType: OphoelType,
        public body: Block,
        public location: Location) {}
}
