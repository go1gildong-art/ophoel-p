import { Statement, ASTKind } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";

export class StructDecl implements Statement {
    kind = ASTKind.StructDecl;

    constructor(
        public name: string,
        public fields: string[],
        public location: Location) {}
}
