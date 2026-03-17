import { stringify } from "node:querystring";
import { ASTs, ASTTypes } from "../ast/ast-collection.cjs";
import { ASTNode } from "../ast/ast.cjs";

class Stringifier {

    constructor(
        public indent: string = "  ",
        public depth: number = 0) { }

    stringify(ast: ASTNode | undefined): string {
        if (typeof ast === "undefined") return "undefined";
        return (this[ast.kind as keyof this] as (node: ASTNode) => string)(ast);
    }

    IntLiteral(ast: ASTTypes["IntLiteral"]) { return ast.raw; }

    FloatLiteral(ast: ASTTypes["FloatLiteral"]) { return ast.raw; }

    BoolLiteral(ast: ASTTypes["BoolLiteral"]) { return ast.raw; }

    StringLiteral(ast: ASTTypes["StringLiteral"]) { return `"${ast.raw}"`; }

    TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"]) { return `\`${ast.raw}\``; }

    VectorLiteral(ast: ASTTypes["VectorLiteral"]) {
        const entries = ast.entries.map(e => this.stringify(e)).join(" ");
        return `(${entries})`;
    }

    CompoundLiteral(ast: ASTTypes["CompoundLiteral"]) {
        const pairs = ast.keys.map((key, i, compound) => `(${key} ${compound[i]})`).join(" ");
        return `(${pairs})`;
    }

    BinaryOperation(ast: ASTTypes["BinaryOperation"]) {
        const left = this.stringify(ast.left);
        const right = this.stringify(ast.right);
        return `(${ast.operator} ${left} ${right})`;
    }

    PreUnary(ast: ASTTypes["PreUnary"]) {
        const right = this.stringify(ast.right);
        return `(${ast.operator} ${right})`;
    }

    PostUnary(ast: ASTTypes["PostUnary"]) {
        const left = this.stringify(ast.left);
        return `(${left} ${ast.operator})`;
    }

    IndexAccess(ast: ASTTypes["IndexAccess"]) {
        const left = this.stringify(ast.left);
        const index = this.stringify(ast.index);
        return `(index ${left} ${index})`;
    }

    MemberAccess(ast: ASTTypes["MemberAccess"]) {
        const left = this.stringify(ast.left);
        return `(member ${left} ${ast.member})`;
    }

    Identifier(ast: ASTTypes["Identifier"]) { return ast.name; }

    ParenExpression(ast: ASTTypes["ParenExpression"]) {
        const expr = this.stringify(ast.expression);
        return `(${expr})`;
    }

    VariableAssign(ast: ASTTypes["VariableAssign"]) {
        const value = this.stringify(ast.setValue);
        return `(= ${ast.address} ${value})`;
    }

    CompoundAssign(ast: ASTTypes["CompoundAssign"]) {
        const operation = ast.operation;
        const value = this.stringify(ast.setValue);
        return `(${operation}= ${ast.address} ${value})`;
    }

    FunctionCall(ast: ASTTypes["FunctionCall"]) {
        const args = ast.args.map(a => this.stringify(a)).join(" ");
        return `(${ast.callee} ${args})`;
    }

    MacroCall(ast: ASTTypes["MacroCall"]) {
        const args = ast.args.map(a => this.stringify(a)).join(" ");
        return `(${ast.callee}! ${args})`;
    }

    Include(ast: ASTTypes["Include"]) {
        return `(include ${ast.path})`;
    }

    FunctionDecl(ast: ASTTypes["FunctionDecl"]) {
        const params = ast.parameters.join(" ");
        const body = this.stringify(ast.body);
        return `(fn ${ast.name} (${params}) ${body})`;
    }

    MacroDecl(ast: ASTTypes["MacroDecl"]) {
        const params = ast.parameters.join(" ");
        const body = this.stringify(ast.body);
        return `(macro ${ast.name} (${params}) ${body})`;
    }

    VariableDecl(ast: ASTTypes["VariableDecl"]) {
        const value = this.stringify(ast.initValue);
        return `(let ${ast.name} ${value})`;
    }

    ConstDecl(ast: ASTTypes["ConstDecl"]) {
        const value = this.stringify(ast.initValue);
        return `(const ${ast.name} ${value})`;
    }

    ChooseStatement(ast: ASTTypes["ChooseStatement"]) {
        const cases = ast.weights
            .map((weight, index) => ({ weight, body: ast.bodies[index] }))

        const ceases = ast..map(c => `(${this.stringify(c.condition)} ${this.stringify(c.consequent)})`).join(" ");
        const defaultCase = ast.defaultCase ? this.stringify(ast.defaultCase) : "";
        return `(choose ${cases} ${defaultCase})`;
    }
}