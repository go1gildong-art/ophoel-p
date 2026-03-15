import { Statement, ASTKind } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";
import { Block } from "../../block.cjs";

export class MacroDecl implements Statement {
    kind = ASTKind.MacroDecl;

    constructor(
        public name: string,
        public parameters: string[],
        public body: Block,
        public location: Location) {}
}
