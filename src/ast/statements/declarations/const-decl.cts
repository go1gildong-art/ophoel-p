import { Statement, Expression, ASTKind } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";

export class ConstDecl implements Statement {
    kind = ASTKind.ConstDecl;

    constructor(
        public name: string,
        public initValue: Expression,
        public location: Location) {}
}
