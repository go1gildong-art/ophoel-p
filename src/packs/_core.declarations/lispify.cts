import { ASTs, ASTTypes } from "../../ast/ast-collection.cjs";
import { ASTNode } from "../../ast/ast.cjs";
import { CondBodySet } from "../../ast/statements/if.cjs";

export function FunctionDecl(ast: ASTTypes["FunctionDecl"]) {
    const params = ast.parameters.join(" ");
    const body = ast.body.lispify();
    return `(fn ${ast.name} (${params}) ${body})`;
}

export function MacroDecl(ast: ASTTypes["MacroDecl"]) {
    const params = ast.parameters.join(" ");
    const body = ast.body.lispify();
    return `(macro ${ast.name} (${params}) ${body})`;
}

export function VariableDecl(ast: ASTTypes["VariableDecl"]) {
    // const value = ast.initValue.lispify();
    const value = "DURING PACK MODULIZATION. NOT IMPLEMENTED YET"
    return `(let ${ast.name} ${value})`;
}

export function ConstDecl(ast: ASTTypes["ConstDecl"]) {
    // const value = ast.initValue.lispify();
    const value = "DURING PACK MODULIZATION. NOT IMPLEMENTED YET"
    return `(const ${ast.name} ${value})`;
}