import { Statement, Expression, ASTKind } from "../../ast.cjs";
import { Location } from "../../../compiler/metadata.cjs";

export class VariableDecl implements Statement {
    kind = ASTKind.VariableDecl;

    constructor(
        public name: string,
        public mutability: boolean,
        public initValue: Expression,
        public location: Location) {}
}
