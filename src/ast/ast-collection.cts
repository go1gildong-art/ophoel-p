import * as Literals from "./expressions/literals.cjs";
import * as Operations from "./expressions/operations.cjs";
import { Identifier } from "./expressions/identifier.cjs";
import { VariableAssign } from "./expressions/var-assign.cjs";
import { CompoundAssign } from "./expressions/compound-assign.cjs";

import { ChooseStatement } from "./statements/choose.cjs";
import { ForOfStatement } from "./statements/for-of.cjs";
import { ForStatement } from "./statements/for.cjs";
import { IfStatement } from "./statements/if.cjs";
import { McCommand } from "./statements/mc-command.cjs";
import { McExecStatement } from "./statements/mc-exec.cjs";
import { RepeatStatement } from "./statements/repeat.cjs";
import { WhileStatement } from "./statements/while.cjs";

import { ExecuteExpression } from "./statements/execute-expr.cjs";

import { FunctionDecl } from "./statements/declarations/fn-decl.cjs";
import { MacroDecl } from "./statements/declarations/macro-decl.cjs";
import { StructDecl } from "./statements/declarations/struct-decl.cjs";
import { VariableDecl } from "./statements/declarations/var-decl.cjs";

import { FunctionCall } from "./expressions/calls/fn-call.cjs";
import { MacroCall } from "./expressions/calls/macro-call.cjs";

import { Include } from "./preprocesses/include.cjs";

import { Block } from "./block.cjs";
import { Program } from "./program.cjs";


export const ASTs = {
    Block,
    Program,

    BoolLiteral: Literals.BoolLiteral,
    CompoundLiteral: Literals.CompoundLiteral,
    FloatLiteral: Literals.FloatLiteral,
    IntLiteral: Literals.IntLiteral,
    StringLiteral: Literals.StringLiteral,
    TemplateStringLiteral: Literals.TemplateStringLiteral,
    VectorLiteral: Literals.VectorLiteral,

    BinaryOperation: Operations.BinaryOperation,
    PreUnary: Operations.PreUnary,
    PostUnary: Operations.PostUnary,
    IndexAccess: Operations.IndexAccess,
    MemberAccess: Operations.MemberAccess,

    VariableAssign,
    CompoundAssign,

    FunctionCall,
    MacroCall,

    Identifier,

    ChooseStatement,
    ForStatement,
    ForOfStatement,
    IfStatement,
    McCommand,
    McExecStatement,
    RepeatStatement,
    WhileStatement,
    ExecuteExpression,

    FunctionDecl,
    MacroDecl,
    StructDecl,
    VariableDecl,

    Include
}
