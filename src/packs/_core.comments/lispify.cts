import { ASTTypes } from "../../pack-combinator.cjs";


export function SLComment(ast: ASTTypes["SLComment"]) {
    return `(// ${ast.content})`;
}

export function MLComment(ast: ASTTypes["MLComment"]) {
    return `(/* ${ast.content} */)`;
}

export function PreservedComment(ast: ASTTypes["PreservedComment"]) {
    return `(/# ${ast.content})`;
}

export function PreservedNewline(ast: ASTTypes["PreservedNewline"]) {
    return `(/.)`;
}
