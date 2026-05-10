import { ASTTypes } from "../../pack-combinator.cjs";

export function Print(ast: ASTTypes["Print"]) {
    return `(print ${ast.content.lispify()})`;
}
