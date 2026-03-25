/*
import { ASTTypes } from "../ast/ast-collection.cjs";
import * as literalLispify from "../packs/_core.literals/lispify.cjs";
import * as operationsLispify from "../packs/_core.operations/lispify.cjs";
import * as controlFlowLispify from "../packs/_core.control-flow/lispify.cjs";
import * as preprocessesLispify from "../packs/_core.preprocesses/lispify.cjs";
import * as backboneLispify from "../packs/_core.backbone/lispify.cjs";
import * as mcLispify from "../packs/_core.mc/lispify.cjs";
import * as exprMiscLispify from "../packs/_core.expr-misc/lispify.cjs";
import { ASTNode } from "../ast/ast.cjs";
import { CondBodySet } from "../packs/_core.control-flow/nodes.cjs";

export function lispify(ast: ASTNode | undefined) {
    return new Lispifier().lispify(ast);
}

export class Lispifier {

    constructor(
        public indent: string = "  ",
        public depth: number = 0) { }

    lispify(ast: ASTNode | undefined): string {
        try {
            if (typeof ast === "undefined") return "undefined";
            return (this[ast.kind as keyof this] as (node: ASTNode) => string)(ast);

        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                throw new Error(`lispifying ${ast?.kind}: ${err.message}`);
            }
            throw err;
        }
    }

    Program(ast: ASTTypes["Program"]) { return backboneLispify.Program(ast); }

    IntLiteral(ast: ASTTypes["IntLiteral"]) { return literalLispify.IntLiteral(ast); }

    FloatLiteral(ast: ASTTypes["FloatLiteral"]) { return literalLispify.FloatLiteral(ast); }

    BoolLiteral(ast: ASTTypes["BoolLiteral"]) { return literalLispify.BoolLiteral(ast); }

    StringLiteral(ast: ASTTypes["StringLiteral"]) { return literalLispify.StringLiteral(ast); }

    TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"]) { return literalLispify.TemplateStringLiteral(ast); }

    VectorLiteral(ast: ASTTypes["VectorLiteral"]) { return literalLispify.VectorLiteral(ast); }

    CompoundLiteral(ast: ASTTypes["CompoundLiteral"]) { return literalLispify.CompoundLiteral(ast); }

    BinaryOperation(ast: ASTTypes["BinaryOperation"]) { return operationsLispify.BinaryOperation(ast); }

    PreUnary(ast: ASTTypes["PreUnary"]) { return operationsLispify.PreUnary(ast); }

    PostUnary(ast: ASTTypes["PostUnary"]) { return operationsLispify.PostUnary(ast); }

    IndexAccess(ast: ASTTypes["IndexAccess"]) { return operationsLispify.IndexAccess(ast); }

    MemberAccess(ast: ASTTypes["MemberAccess"]) { return operationsLispify.MemberAccess(ast); }

    Identifier(ast: ASTTypes["Identifier"]) { return exprMiscLispify.Identifier(ast); }

    ParenExpression(ast: ASTTypes["ParenExpression"]) {
        return exprMiscLispify.ParenExpression(ast);
    }

    VariableAssign(ast: ASTTypes["VariableAssign"]) {
        return exprMiscLispify.VariableAssign(ast);
    }

    CompoundAssign(ast: ASTTypes["CompoundAssign"]) {
        const operation = ast.operation;
        const value = this.lispify(ast.setValue);
        return `(${operation}= ${ast.address} ${value})`;
    }

    FunctionCall(ast: ASTTypes["FunctionCall"]) {
        const args = ast.args.map(a => this.lispify(a)).join(" ");
        return `(${ast.callee} ${args})`;
    }

    MacroCall(ast: ASTTypes["MacroCall"]) {
        const args = ast.args.map(a => this.lispify(a)).join(" ");
        return `(${ast.callee}! ${args})`;
    }

    Include(ast: ASTTypes["Include"]) { return preprocessesLispify.Include(ast); }

    FunctionDecl(ast: ASTTypes["FunctionDecl"]) {
        const params = ast.parameters.join(" ");
        const body = this.lispify(ast.body);
        return `(fn ${ast.name} (${params}) ${body})`;
    }

    MacroDecl(ast: ASTTypes["MacroDecl"]) {
        const params = ast.parameters.join(" ");
        const body = this.lispify(ast.body);
        return `(macro ${ast.name} (${params}) ${body})`;
    }

    VariableDecl(ast: ASTTypes["VariableDecl"]) {
        const value = this.lispify(ast.initValue);
        return `(let ${ast.name} ${value})`;
    }

    ConstDecl(ast: ASTTypes["ConstDecl"]) {
        const value = this.lispify(ast.initValue);
        return `(const ${ast.name} ${value})`;
    }

    ChooseStatement(ast: ASTTypes["ChooseStatement"]) { return controlFlowLispify.ChooseStatement(ast); }
    ForOfStatement(ast: ASTTypes["ForOfStatement"]) { return controlFlowLispify.ForOfStatement(ast); }
    ForStatement(ast: ASTTypes["ForStatement"]) { return controlFlowLispify.ForStatement(ast); }
    IfStatement(ast: ASTTypes["IfStatement"]) { return controlFlowLispify.IfStatement(ast); }
    McCommand(ast: ASTTypes["McCommand"]) { return mcLispify.McCommand(ast); }
    McExecStatement(ast: ASTTypes["McExecStatement"]) { return mcLispify.McExecStatement(ast); }
    RepeatStatement(ast: ASTTypes["RepeatStatement"]) { return controlFlowLispify.RepeatStatement(ast); }
    WhileStatement(ast: ASTTypes["WhileStatement"]) { return controlFlowLispify.WhileStatement(ast); }
    ReturnStatement(ast: ASTTypes["ReturnStatement"]) { return controlFlowLispify.ReturnStatement(ast); }
    Block(ast: ASTTypes["Block"]) { return backboneLispify.Block(ast); }

    

}

*/