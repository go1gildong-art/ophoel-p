import { ASTTypes } from "../ast/ast-collection.cjs";
import * as literalLispify from "../packs/_core.literals/lispify.cjs";
import { ASTNode } from "../ast/ast.cjs";
import { CondBodySet } from "../ast/statements/if.cjs";

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

    Program(ast: ASTTypes["Program"]) {
        const body = ast.body.map(s => this.lispify(s)).join(" ");
        return `(program ${body})`;
    }

    IntLiteral(ast: ASTTypes["IntLiteral"]) { return literalLispify.IntLiteral(ast); }

    FloatLiteral(ast: ASTTypes["FloatLiteral"]) { return literalLispify.FloatLiteral(ast); }

    BoolLiteral(ast: ASTTypes["BoolLiteral"]) { return literalLispify.BoolLiteral(ast); }

    StringLiteral(ast: ASTTypes["StringLiteral"]) { return literalLispify.StringLiteral(ast); }

    TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"]) { return literalLispify.TemplateStringLiteral(ast); }

    VectorLiteral(ast: ASTTypes["VectorLiteral"]) {
        return literalLispify.VectorLiteral(ast);
    }

    CompoundLiteral(ast: ASTTypes["CompoundLiteral"]) {
        return literalLispify.CompoundLiteral(ast);
    }

    BinaryOperation(ast: ASTTypes["BinaryOperation"]) {
        const left = this.lispify(ast.left);
        const right = this.lispify(ast.right);
        return `(${ast.operator} ${left} ${right})`;
    }

    PreUnary(ast: ASTTypes["PreUnary"]) {
        const right = this.lispify(ast.right);
        return `(${ast.operator} ${right})`;
    }

    PostUnary(ast: ASTTypes["PostUnary"]) {
        const left = this.lispify(ast.left);
        return `(${left} ${ast.operator})`;
    }

    IndexAccess(ast: ASTTypes["IndexAccess"]) {
        const left = this.lispify(ast.left);
        const index = this.lispify(ast.index);
        return `(index ${left} ${index})`;
    }

    MemberAccess(ast: ASTTypes["MemberAccess"]) {
        const left = this.lispify(ast.left);
        return `(member ${left} ${ast.member})`;
    }

    Identifier(ast: ASTTypes["Identifier"]) { return ast.name; }

    ParenExpression(ast: ASTTypes["ParenExpression"]) {
        const expr = this.lispify(ast.expression);
        return `(${expr})`;
    }

    VariableAssign(ast: ASTTypes["VariableAssign"]) {
        const value = this.lispify(ast.setValue);
        return `(= ${ast.address} ${value})`;
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

    Include(ast: ASTTypes["Include"]) {
        return `(include ${ast.path})`;
    }

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

    ChooseStatement(ast: ASTTypes["ChooseStatement"]) {
        const cases = ast.weights
            .map((weight, index) => ({ weight, body: ast.bodies[index] }))
            .map(({ weight, body }) => `(${this.lispify(weight)} ${this.lispify(body)})`);

        return `(choose ${cases})`;
    }

    ForOfStatement(ast: ASTTypes["ForOfStatement"]) {
        const target = this.lispify(ast.target);
        const body = this.lispify(ast.body);
        return `(for ${ast.iterator} of ${target} ${body})`;
    }

    ForStatement(ast: ASTTypes["ForStatement"]) {
        const init = this.lispify(ast.declaration);
        const condition = this.lispify(ast.condition);
        const increment = this.lispify(ast.increment);
        const body = this.lispify(ast.body);
        return `(for ${init} ${condition} ${increment} ${body})`;
    }

    IfStatement(ast: ASTTypes["IfStatement"]) {
        const lispifySignature =
            (sign: CondBodySet) => `${this.lispify(sign.condition)} ${this.lispify(sign.body)})`;

        const mainBranch = `(if ${lispifySignature(ast.ifSignature)}`;
        const elifBranches = ast.elifSignatures
            .map(sign => lispifySignature(sign))
            .map(sign => `(elif ${sign})`)
            .join(" ");
        const elseBranch = typeof ast.elseSignature !== "undefined"
            ? `(else ${lispifySignature(ast.elseSignature)})`
            : "";

        return [mainBranch, ...elifBranches, elseBranch].join("");
    }

    McCommand(ast: ASTTypes["McCommand"]) {
        const arg = this.lispify(ast.argument);
        return `(${ast.command}!! ${arg})`;
    }

    McExecStatement(ast: ASTTypes["McExecStatement"]) {
        const prefix = this.lispify(ast.prefix);
        const body = this.lispify(ast.body);
        return `(mc_exec ${prefix}!! ${body})`;
    }

    RepeatStatement(ast: ASTTypes["RepeatStatement"]) {
        const count = this.lispify(ast.count);
        const body = this.lispify(ast.body);
        return `(repeat ${count} ${body})`;
    }

    WhileStatement(ast: ASTTypes["WhileStatement"]) {
        const condition = this.lispify(ast.condition);
        const body = this.lispify(ast.body);
        return `(while ${condition} ${body})`;
    }

    ExecuteExpression(ast: ASTTypes["ExecuteExpression"]) {
        const expr = this.lispify(ast.expression);
        return `(execute ${expr})`;
    }

    ReturnStatement(ast: ASTTypes["ReturnStatement"]) {
        const value = ast.value != undefined ? this.lispify(ast.value) : "";
        return value ? `(return ${value})` : "(return)";
    }

    Block(ast: ASTTypes["Block"]) {
        const statements = ast.statements.map(s => this.lispify(s)).join(" ");
        return `(block (${statements}))`;
    }

    

}