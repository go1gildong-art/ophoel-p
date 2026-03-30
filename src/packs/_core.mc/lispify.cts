import { ASTTypes } from "../../ast/ast-collection.cjs";
import { lispify as baseLispify } from "../../stringifiers/lispify.cjs";

export function McCommand(ast: ASTTypes["McCommand"]) {
    return `(${ast.command}!! ${baseLispify(ast.argument)})`;
}

export function McExecStatement(ast: ASTTypes["McExecStatement"]) {
    return `(mc_exec ${baseLispify(ast.prefix)}!! ${baseLispify(ast.body)})`;
}
