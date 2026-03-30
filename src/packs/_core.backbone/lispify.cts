import { ASTTypes } from "../../ast/ast-collection.cjs";
import { lispify as baseLispify } from "../../stringifiers/lispify.cjs";

export function Block(ast: ASTTypes["Block"]) {
    const statements = ast.statements.map(s => baseLispify(s)).join(" ");
    return `{ ${statements} }`;
}

export function Program(ast: ASTTypes["Program"]) {
    const body = ast.body.map(s => baseLispify(s)).join(" ");
    return `(program ${body})`;
}
