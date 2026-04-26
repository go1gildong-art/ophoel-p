import { ASTTypes } from "../../pack-combinator.cjs";


export function BinaryOperation(ast: ASTTypes["BinaryOperation"]) {
    const left = ast.left.lispify();
    const right = ast.right.lispify();
    return `(${ast.operator} ${left} ${right})`;
}

export function PreUnary(ast: ASTTypes["PreUnary"]) {
    const right = ast.right.lispify();
    return `(${ast.operator} ${right})`;
}

export function PostUnary(ast: ASTTypes["PostUnary"]) {
    const left = ast.left.lispify();
    return `(${left} ${ast.operator})`;
}

export function IndexAccess(ast: ASTTypes["IndexAccess"]) {
    const left = ast.left.lispify();
    const index = ast.index.lispify();
    return `([] ${left} ${index})`;
}

export function MemberAccess(ast: ASTTypes["MemberAccess"]) {
    const left = ast.left.lispify();
    return `(. ${left} ${ast.member})`;
}

export function FunctionCall(ast: ASTTypes["FunctionCall"]) {
    const args = ast.args.map((arg) => arg.lispify()).join(" ");
    return `(${ast.callee.lispify()} ${args})`;
}

export function VariableAssign(ast: ASTTypes["VariableAssign"]) {
    const address = ast.address.lispify();
    const value = ast.setValue.lispify();
    return `(= ${address} ${value})`;
}

export function CompoundAssign(ast: ASTTypes["CompoundAssign"]) {
    const address = ast.address.lispify();
    const value = ast.setValue.lispify();
    return `(=${ast.operation} ${address} ${value})`;
}

export function MacroCall(ast: ASTTypes["MacroCall"]) {
    const args = ast.args.map((arg) => arg.lispify()).join(" ");
    return `(${ast.callee.lispify()}! ${args})`;
}