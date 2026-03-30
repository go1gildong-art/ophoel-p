import { ASTTypes } from "../../ast/ast-collection.cjs";
import { lispify as baseLispify } from "../../stringifiers/lispify.cjs";
import { CondBodySet } from "../../packs/_core.control-flow/nodes.cjs";

export function IfStatement(ast: ASTTypes["IfStatement"]) {
    const lispifySignature = (sign: CondBodySet) => `${baseLispify(sign.condition)} ${baseLispify(sign.body)})`;
    const mainBranch = `(if ${lispifySignature(ast.ifSignature)}`;
    const elifBranches = ast.elifSignatures
        .map(sign => lispifySignature(sign))
        .map(sign => `(elif ${sign})`)
        .join(" ");
    const elseBranch = typeof ast.elseSignature !== "undefined"
        ? `(else ${lispifySignature(ast.elseSignature)})`
        : "";
    const parts = [mainBranch];
    if (elifBranches) parts.push(elifBranches);
    if (elseBranch) parts.push(elseBranch);
    return parts.join("");
}

export function WhileStatement(ast: ASTTypes["WhileStatement"]) {
    return `(while ${baseLispify(ast.condition)} ${baseLispify(ast.body)})`;
}

export function ForStatement(ast: ASTTypes["ForStatement"]) {
    return `(for ${baseLispify(ast.declaration)} ${baseLispify(ast.condition)} ${baseLispify(ast.increment)} ${baseLispify(ast.body)})`;
}

export function ForOfStatement(ast: ASTTypes["ForOfStatement"]) {
    return `(for ${baseLispify(ast.declaration)} of ${baseLispify(ast.iterable)} ${baseLispify(ast.body)})`;
}

export function RepeatStatement(ast: ASTTypes["RepeatStatement"]) {
    return `(repeat ${baseLispify(ast.count)} ${baseLispify(ast.body)})`;
}

export function ChooseStatement(ast: ASTTypes["ChooseStatement"]) {
    const cases = ast.weights
        .map((weight, i) => `(${baseLispify(weight)} ${baseLispify(ast.bodies[i])})`)
        .join(" ");
    return `(choose ${cases})`;
}

export function ReturnStatement(ast: ASTTypes["ReturnStatement"]) {
    const value = ast.value ? baseLispify(ast.value) : "";
    return `(return ${value})`;
}
