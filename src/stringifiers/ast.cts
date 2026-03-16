import { ASTs, ASTTypes } from "../ast/ast-collection.cjs";

class Stringifier {

    constructor(
        public indent: string = "  ",
        public depth: number = 0) { }

    
    intLiteral(ast: ASTTypes["IntLiteral"]) { return ast.raw; }
    floatLiteral(ast: ASTTypes["FloatLiteral"]) { return ast.raw; }
    boolLiteral(ast: ASTTypes["BoolLiteral"]) { return ast.raw; }
    stringLiteral(ast: ASTTypes["StringLiteral"]) { return `"${ast.value}"`; }
    templateStringLiteral(ast: ASTTypes["TemplateStringLiteral"]) { return `\`${ast.value}\``; }
}