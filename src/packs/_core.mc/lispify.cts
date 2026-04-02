import { ASTTypes } from "../../pack-combinator.cjs";


export function McCommand(ast: ASTTypes["McCommand"]) {
    return `(${ast.command}!! ${ast.argument.lispify()})`;
}

export function McExecStatement(ast: ASTTypes["McExecStatement"]) {
    return `(mc_exec ${ast.prefix.lispify()}!! ${ast.body.lispify()})`;
}
