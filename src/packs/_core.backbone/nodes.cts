import { Block } from "../../ast/block.cjs";
import { Program } from "../../ast/program.cjs";
import { Statement, ASTKind } from "../../ast/ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

// Expand existing nodes to a pack.
export class Block implements Statement {
    kind = ASTKind.Block;

    constructor(public statements: Statement[], public location: Location) {}
}

export class Program implements Statement {
    kind = ASTKind.Program;

    constructor(public body: Statement[], public location: Location) {}
}
