import { Expression, Statement, ASTKind } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";


export class McCommand implements Statement {
    kind = ASTKind.McCommand;

    constructor(
        public command: string,
        public argument: Expression,
        public location: Location) {}
}
