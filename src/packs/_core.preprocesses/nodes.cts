import { Preprocess, Statement, ASTKind } from "../../ast/ast.cjs";
import { Expression } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class Include implements Statement, Preprocess {
    kind = ASTKind.Include;
    constructor(public path: string, public location: Location) {}
}
