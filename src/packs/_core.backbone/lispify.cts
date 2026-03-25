import { ASTTypes } from "../../ast/ast-collection.cjs";

export function Block(ast: ASTTypes["Block"]) {
    const statements = ast.statements
    .map(s => s.lispify())
    .map(s => `(${s})`);

    return `( ${statements.join(" ")} )`;
}

export function Program(ast: ASTTypes["Program"]) {
    const body = ast.body.map(s => s.lispify()).join(" ");
    return `(program ${body})`;
}
