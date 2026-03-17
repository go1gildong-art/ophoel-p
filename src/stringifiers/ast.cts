import { stringify } from "node:querystring";
import { ASTs, ASTTypes } from "../ast/ast-collection.cjs";
import { ASTNode } from "../ast/ast.cjs";

class Stringifier {

    constructor(
        public indent: string = "  ",
        public depth: number = 0) { }

    stringify(ast: ASTNode): string {
        const methodName = ast.kind.charAt(0).toLowerCase() + ast.kind.slice(1);
        return this[methodName](ast);
    }

    intLiteral(ast: ASTTypes["IntLiteral"]) { return ast.raw; }

    floatLiteral(ast: ASTTypes["FloatLiteral"]) { return ast.raw; }

    boolLiteral(ast: ASTTypes["BoolLiteral"]) { return ast.raw; }

    stringLiteral(ast: ASTTypes["StringLiteral"]) { return `"${ast.raw}"`; }

    templateStringLiteral(ast: ASTTypes["TemplateStringLiteral"]) { return `\`${ast.raw}\``; }

    vectorLiteral(ast: ASTTypes["VectorLiteral"]) {
        const entries = ast.entries.map(e => this.stringify(e)).join(" ");
        return `(${entries})`;
    }

    compoundLiteral(ast: ASTTypes["CompoundLiteral"]) {
        const pairs = ast.keys.map((key, i, compound) => `(${key} ${compound[i]})`).join(" ");
        return `(${pairs})`;
    }

    binaryOperation(ast: ASTTypes["BinaryOperation"]) {
        const left = this.stringify(ast.left);
        const right = this.stringify(ast.right);
        return `(${ast.operator} ${left} ${right})`;
    }

    preUnary(ast: ASTTypes["PreUnary"]) {
        const right = this.stringify(ast.right);
        return `(${ast.operator} ${right})`;
    }

    postUnary(ast: ASTTypes["PostUnary"]) {
        const left = this.stringify(ast.left);
        return `(${left} ${ast.operator})`;
    }

    indexAccess(ast: ASTTypes["IndexAccess"]) {
        const left = this.stringify(ast.left);
        const index = this.stringify(ast.index);
        return `(index ${left} ${index})`;
    }

    memberAccess(ast: ASTTypes["MemberAccess"]) {
        const left = this.stringify(ast.left);
        return `(member ${left} ${ast.member})`;
    }

    identifier(ast: ASTTypes["Identifier"]) { return ast.name; }

    parenExpr(ast: ASTTypes["ParenExpression"]) {
        const expr = this.stringify(ast.expression);
        return `(${expr})`;
    }

    variableAssign(ast: ASTTypes["VariableAssign"]) {
        const value = this.stringify(ast.setValue);
        return `(= ${ast.address} ${value})`;
    }

    compoundAssign(ast: ASTTypes["CompoundAssign"]) {
        const operation = ast.operation;
        const value = this.stringify(ast.setValue);
        return `(${operation}= ${ast.address} ${value})`;
    }

    functionCall(ast: ASTTypes["FunctionCall"]) {
        const args = ast.args.map(a => this.stringify(a)).join(" ");
        return `(${ast.callee} ${args})`;
    }

    macroCall(ast: ASTTypes["MacroCall"]) {
        const args = ast.args.map(a => this.stringify(a)).join(" ");
        return `(${ast.callee}! ${args})`;
    }
}