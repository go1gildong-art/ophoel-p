import { ASTTypes } from "../../ast/ast-collection.cjs";

export function Block(ast: ASTTypes["Block"]) {
    const statements = ast.statements
    .map(s => s.lispify());

    return `(block (${statements.join(" ")}))`;
}

export function ExecExpr(ast: ASTTypes["ExecExpr"]) {

    return `(ex ${ast.expression.lispify()})`;
}

export function Program(ast: ASTTypes["Program"]) {
    const body = ast.body.map(s => s.lispify()).join(" ");
    return `(program ${body})`;
}
