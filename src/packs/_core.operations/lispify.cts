import { ASTTypes } from "../../ast/ast-collection.cjs";
import { lispify as baseLispify } from "../../stringifiers/lispify.cjs";

export function BinaryOperation(ast: ASTTypes["BinaryOperation"]) {
    const left = baseLispify(ast.left as any);
    const right = baseLispify(ast.right as any);
    return `(${ast.operator} ${left} ${right})`;
}

export function PreUnary(ast: ASTTypes["PreUnary"]) {
    const right = baseLispify(ast.right as any);
    return `(${ast.operator} ${right})`;
}

export function PostUnary(ast: ASTTypes["PostUnary"]) {
    const left = baseLispify(ast.left as any);
    return `(${left} ${ast.operator})`;
}

export function IndexAccess(ast: ASTTypes["IndexAccess"]) {
    const left = baseLispify(ast.left as any);
    const index = baseLispify(ast.index as any);
    return `(index ${left} ${index})`;
}

export function MemberAccess(ast: ASTTypes["MemberAccess"]) {
    const left = baseLispify(ast.left as any);
    return `(member ${left} ${ast.member})`;
}
