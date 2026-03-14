import { Statement } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";
import { Block } from "../../block.cjs";

export class MacroDecl implements Statement {
    kind = "MacroDecl";

    constructor(
        public name: string,
        public parameters: string[],
        public body: Block,
        public location: Location) {}
}
