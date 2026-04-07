import { ASTTypes } from "../../pack-combinator.cjs";

export function Identifier(ast: ASTTypes["Identifier"]) {
    return ast.name;
}

export function ParenExpression(ast: ASTTypes["ParenExpression"]) {
    const expr = ast.expression.lispify();
    return `(${expr})`;
}
