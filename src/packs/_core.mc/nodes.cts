import { Statement, Expression, ASTKind } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class McCommand implements Statement {
    kind = ASTKind.McCommand;

    constructor(public command: string, public argument: Expression, public location: Location) {}
}

export class McExecStatement implements Statement {
    kind = ASTKind.McExecStatement;

    constructor(public prefix: Expression, public body: Statement, public location: Location) {}
}
