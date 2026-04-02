import { ASTTypes } from "../../pack-combinator.cjs";

export function Identifier(ast: ASTTypes["Identifier"]) {
    return ast.name;
}

export function ParenExpression(ast: ASTTypes["ParenExpression"]) {
    const expr = ast.expression.lispify();
    return `(${expr})`;
}

export function VariableAssign(ast: ASTTypes["VariableAssign"]) {
    const address = ast.address.lispify();
    const value = ast.setValue.lispify();
    return `(= ${address} ${value})`;
}

export function CompoundAssign(ast: ASTTypes["CompoundAssign"]) {
    const address = ast.address.lispify();
    const value = ast.setValue.lispify();
    return `(=${ast.operation} ${address} ${value})`;
}
