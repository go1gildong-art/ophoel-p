import { Expression, Preprocess, Statement, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";


export class Include implements Preprocess {
    kind = ASTKind.Include;

    constructor(
        public path: string,
        public location: Location) {}
}
