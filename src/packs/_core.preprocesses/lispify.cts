import { ASTTypes } from "../../ast/ast-collection.cjs";

export function Include(ast: ASTTypes["Include"]) {
    return `include ${ast.path}`;
}
