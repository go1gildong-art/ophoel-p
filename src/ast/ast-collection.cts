import * as Literals from "../packs/_core.literals/nodes.cjs";
import * as Operations from "../packs/_core.operations/nodes.cjs";
import { Identifier } from "./expressions/identifier.cjs";
import { VariableAssign } from "./expressions/var-assign.cjs";
import { CompoundAssign } from "./expressions/compound-assign.cjs";

import * as ControlFlow from "../packs/_core.control-flow/nodes.cjs";
import { McCommand, McExecStatement } from "../packs/_core.mc/nodes.cjs";
import { Include } from "../packs/_core.preprocesses/nodes.cjs";
import { Block, Program } from "../packs/_core.backbone/nodes.cjs";


/*
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

    ParenExpression,
    Identifier,

    ChooseStatement: ControlFlow.ChooseStatement,
    ForStatement: ControlFlow.ForStatement,
    ForOfStatement: ControlFlow.ForOfStatement,
    IfStatement: ControlFlow.IfStatement,
    McCommand,
    McExecStatement,
    RepeatStatement: ControlFlow.RepeatStatement,
    ReturnStatement: ControlFlow.ReturnStatement,
    WhileStatement: ControlFlow.WhileStatement,
    ExecuteExpression,

    FunctionDecl,
    MacroDecl,
    VariableDecl,
    ConstDecl,

    Include,

    Block,
    Program
}



type Constructors = typeof ASTs

export type ASTTypes = {
  [K in keyof Constructors]: InstanceType<Constructors[K]>
};
*/