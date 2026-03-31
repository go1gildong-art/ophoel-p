import * as Literals from "../packs/_core.literals/nodes.cjs";
import * as Operations from "../packs/_core.operations/nodes.cjs";
import * as ExprMisc from "../packs/_core.expr-misc/nodes.cjs";

import * as Declarations from "../packs/_core.declarations/nodes.cjs";

import * as ControlFlow from "../packs/_core.control-flow/nodes.cjs";
import { McCommand, McExecStatement } from "../packs/_core.mc/nodes.cjs";
import { Include } from "../packs/_core.preprocesses/nodes.cjs";
import * as Backbone from "../packs/_core.backbone/nodes.cjs";

export const ASTs = {
    Block: Backbone.Block,
    Program: Backbone.Program,

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

    VariableAssign: ExprMisc.VariableAssign,
    CompoundAssign: ExprMisc.CompoundAssign,

    FunctionCall: Operations.FunctionCall,
    MacroCall: Operations.MacroCall,

    ParenExpression: ExprMisc.ParenExpression,
    Identifier: ExprMisc.Identifier,
    ExecExpr: Backbone.ExecExpr,

    ChooseStatement: ControlFlow.ChooseStatement,
    ForStatement: ControlFlow.ForStatement,
    ForOfStatement: ControlFlow.ForOfStatement,
    IfStatement: ControlFlow.IfStatement,
    McCommand,
    McExecStatement,
    RepeatStatement: ControlFlow.RepeatStatement,
    ReturnStatement: ControlFlow.ReturnStatement,
    WhileStatement: ControlFlow.WhileStatement,

    FunctionDecl: Declarations.FunctionDecl,
    MacroDecl: Declarations.MacroDecl,
    VariableDecl: Declarations.VariableDecl,
    ConstDecl: Declarations.ConstDecl,

    Include
}

type Constructors = typeof ASTs

export type ASTTypes = {
  [K in keyof Constructors]: InstanceType<Constructors[K]>
};