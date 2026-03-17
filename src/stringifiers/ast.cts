import { ASTs, ASTTypes } from "../ast/ast-collection.cjs";
import { ASTNode } from "../ast/ast.cjs";
import { CondBodySet } from "../ast/statements/if.cjs";

export class Stringifier {

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
            .map(({ weight, body }) => `(${this.stringify(weight)} ${this.stringify(body)})`);

        return `(choose ${cases})`;
    }

    ForOfStatement(ast: ASTTypes["ForOfStatement"]) {
        const target = this.stringify(ast.target);
        const body = this.stringify(ast.body);
        return `(for ${ast.iterator} of ${target} ${body})`;
    }

    ForStatement(ast: ASTTypes["ForStatement"]) {
        const init = this.stringify(ast.declaration);
        const condition = this.stringify(ast.condition);
        const increment = this.stringify(ast.increment);
        const body = this.stringify(ast.body);
        return `(for ${init} ${condition} ${increment} ${body})`;
    }

    IfStatement(ast: ASTTypes["IfStatement"]) {
        const stringifySignature =
            (sign: CondBodySet) => `(${this.stringify(sign.condition)} ${this.stringify(sign.body)})`;

        const mainBranch = `(if ${stringifySignature(ast.ifSignature)}`;
        const elifBranches = ast.elifSignatures
            .map(sign => stringifySignature(sign))
            .map(sign => `(elif ${sign})`)
            .join(" ");
        const elseBranch = typeof ast.elseSignature !== "undefined"
            ? `(else ${stringifySignature(ast.elseSignature)})`
            : "";

        return [mainBranch, ...elifBranches, elseBranch].join("");
    }

    McCommand(ast: ASTTypes["McCommand"]) {
        const arg = this.stringify(ast.argument);
        return `(${ast.command}!! ${arg})`;
    }

    RepeatStatement(ast: ASTTypes["RepeatStatement"]) {
        const count = this.stringify(ast.count);
        const body = this.stringify(ast.body);
        return `(repeat ${count} ${body})`;
    }

    WhileStatement(ast: ASTTypes["WhileStatement"]) {
        const condition = this.stringify(ast.condition);
        const body = this.stringify(ast.body);
        return `(while ${condition} ${body})`;
    }

    ExecuteExpression(ast: ASTTypes["ExecuteExpression"]) {
        const expr = this.stringify(ast.expression);
        return `(execute ${expr})`;
    }

    Block(ast: ASTTypes["Block"]) {
        const statements = ast.statements.map(s => this.stringify(s)).join(" ");
        return `(block ${statements})`;
    }

    Program(ast: ASTTypes["Program"]) {
        const body = ast.body.map(s => this.stringify(s)).join(" ");
        return `(program ${body})`;
    }
}