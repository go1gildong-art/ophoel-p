
import { Location } from "../compiler/metadata.cjs";
import { OphoelValue } from "./types.cjs";

export enum ASTKind {
    BinaryOperation = "BinaryOperation",
    Block = "Block",
    BoolLiteral = "BoolLiteral",
    ChooseStatement = "ChooseStatement",
    CompoundAssign = "CompoundAssign",
    CompoundLiteral = "CompoundLiteral",
    ConstDecl = "ConstDecl",
    ExecuteExpression = "ExecuteExpression",
    FloatLiteral = "FloatLiteral",
    ForOfStatement = "ForOfStatement",
    ForStatement = "ForStatement",
    FunctionCall = "FunctionCall",
    FunctionDecl = "FunctionDecl",
    Identifier = "Identifier",
    IfStatement = "IfStatement",
    Include = "Include",
    IndexAccess = "IndexAccess",
    IntLiteral = "IntLiteral",
    MacroCall = "MacroCall",
    MacroDecl = "MacroDecl",
    McCommand = "McCommand",
    McExecStatement = "McExecStatement",
    MemberAccess = "MemberAccess",
    ParenExpression = "ParenExpression",
    PostUnary = "PostUnary",
    PreUnary = "PreUnary",
    Program = "Program",
    RepeatStatement = "RepeatStatement",
    StringLiteral = "StringLiteral",
    StructDecl = "StructDecl",
    TemplateStringLiteral = "TemplateStringLiteral",
    VariableAssign = "VariableAssign",
    VariableDecl = "VariableDecl",
    VectorLiteral = "VectorLiteral",
    WhileStatement = "WhileStatement",
}

export interface ASTNode {
    kind: ASTKind;
    location: Location;
}

export interface Preprocess extends ASTNode {}

export interface Expression extends ASTNode {
    value?: OphoelValue;
}

export interface LValue extends Expression {}

export interface Statement extends ASTNode {}

export interface Call extends ASTNode {
    args: Expression[];
    callee: string;
}
