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

import { Location } from "../metadata.cjs";
import { Expression } from "./ast.cjs";
import { Block } from "./block.cjs";
import { OphoelType } from "./types.cjs";

const BuildAST = {
    ...BuildLiterals,
    ...BuildOperations
}

const BuildLiterals = {
    BoolLiteral: (raw: string, location: Location) 
        => new Literals.BoolLiteral(raw, location),

    CompoundLiteral: (keys: string[], values: Expression[], location: Location)
        => new Literals.CompoundLiteral(keys, values, location),

    FloatLiteral: (raw: string, location: Location)
        => new Literals.FloatLiteral(raw, location),

    IntLiteral: (raw: string, location: Location)
        => new Literals.IntLiteral(raw, location),

    StringLiteral: (raw: string, location: Location)
        => new Literals.StringLiteral(raw, location),

    TemplateStringLiteral: (quasis: string[], expressions: Expression[], location: Location)
        => new Literals.TemplateStringLiteral(quasis, expressions, location),
    
    VectorLiteral: (entries: Expression[], locaiton: Location)
        => new Literals.VectorLiteral(entries, locaiton)
}

const BuildOperations = {
    BinaryOperation: (left: Expression, operator: Operations.BinaryOperator, right: Expression, location: Location)
        => new Operations.BinaryOperation(left, operator, right, location),

    UnaryOperation: (operator: Operations.UnaryOperator, right: Expression, location: Location)
        => new Operations.UnaryOperation(operator, right, location),

    IndexAccess: (left: Expression, index: Expression, location: Location)
        => new Operations.IndexAccess(left, IndexAccess, location),

    MemberAccess: (left: Expression, field: string, location: Location)
        => new Operations.MemberAccess(left, field, location)
}

const BuildDeclarations = {
    CompoundAssign: (address: Expression, operation: Operations.BinaryOperator, setValue: Expression, location: Location)
        => new CompoundAssign(address, operation, setValue, location),

    FunctionDecl: (name: string, parameters: { name: string, type: OphoelType }[], returnType: OphoelType, body: Block, location: Location)
        => new FunctionDecl(name, parameters, returnType, body, location),

    MacroDecl: (name: string, parameters: { name: string, type: OphoelType }[], returnType: OphoelType, body: Block, location: Location)
        => new MacroDecl(name, parameters, returnType, body, location),

    StructDecl: (name: string, fields: { name: string, type: OphoelType }[], location: Location)
        => new StructDecl(name, fields, location),

    VariableAssign: (address: Expression, setValue: Expression, locaiton: Location)
        => new VariableAssign(address, setValue, location)
}



const BuildMiscalenous = {
    Identifier: (name: string, location: Location) 
        => new Identifier(name, location)
}

new ChooseStatement()




    ChooseStatement: (weights: Expressions[], bodies: Block[], location: Location)
        => new ChooseStatement(weights, bodies, location),