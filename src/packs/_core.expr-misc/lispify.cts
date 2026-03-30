import { ASTTypes } from "../../ast/ast-collection.cjs";
import { lispify as baseLispify } from "../../stringifiers/lispify.cjs";

export function Identifier(ast: ASTTypes["Identifier"]) {
    return ast.name;
}

export function ParenExpression(ast: ASTTypes["ParenExpression"]) {
    const expr = baseLispify(ast.expression as any);
    return `(${expr})`;
}

export function VariableAssign(ast: ASTTypes["VariableAssign"]) {
    const address = baseLispify(ast.address as any);
    const value = baseLispify(ast.setValue as any);
    return `(= ${address} ${value})`;
}
