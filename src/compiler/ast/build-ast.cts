import * as Literals from "./expressions/literals.cjs";
import * as Operations from "./expressions/operations.cjs";
import { Identifier } from "../../compiler-old/ast";

import { ChooseStatement } from "./statements/choose.cjs";
import { ForOfStatement } from "./statements/for-of.cjs";
import { ForStatement } from "./statements/for.cjs";
import { IfStatement } from "./statements/if.cjs";
import { McCommand } from "./statements/mc-command.cjs";
import { McExecStatement } from "./statements/mc-exec.cjs";
import { RepeatStatement } from "./statements/repeat.cjs";
import { WhileStatement } from "./statements/while.cjs";

import { CompoundAssign } from "./statements/declarations/compound-assign.cjs";
import { FunctionDecl } from "./statements/declarations/fn-decl.cjs";
import { MacroDecl } from "./statements/declarations/macro-decl.cjs";
import { StructDecl } from "./statements/declarations/struct-decl.cjs";
import { VariableAssign } from "./statements/declarations/var-assign.cjs";
import { VariableDecl } from "./statements/declarations/var-decl.cjs";

import { FunctionCall } from "./calls/fn-call.cjs";
import { MacroCall } from "./calls/macro-call.cjs";

import { Include } from "./preprocesses/include.cjs";

import { Block } from "./block.cjs";
import { Program } from "./program.cjs";


export const ASTCollection = {
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
    UnaryOperation: Operations.UnaryOperation,
    IndexAccess: Operations.IndexAccess,
    MemberAccess: Operations.MemberAccess,

    Identifier,

    ChooseStatement,
    ForStatement,
    ForOfStatement,
    IfStatement,
    McCommand,
    McExecStatement,
    RepeatStatement,
    WhileStatement,

    CompoundAssign,
    FunctionDecl,
    MacroDecl,
    StructDecl,
    VariableAssign,
    VariableDecl,

    FunctionCall,
    MacroCall,

    Include
}
