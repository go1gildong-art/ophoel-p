import { ASTTypes } from "../../pack-combinator.cjs";

export function Include(ast: ASTTypes["Include"]) {
    return `(include ${ast.path.lispify()})`;
}
