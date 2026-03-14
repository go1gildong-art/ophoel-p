import { Statement } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";
import { Block } from "../../block.cjs";

export class FunctionDecl implements Statement {
    kind = "FunctionDecl";

    constructor(
        public name: string,
        public parameters: string[],
        public body: Block,
        public location: Location) {}
}
