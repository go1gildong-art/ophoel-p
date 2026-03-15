import { Expression, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class Identifier implements Expression {
    kind = ASTKind.Identifier;

    constructor(
        public name: string, 
        public location: Location) {}
}
