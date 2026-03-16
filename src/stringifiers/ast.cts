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

    
}