import * as fp from "@utils/functional.cjs"
import { ASTTypes } from "../../pack-combinator.cjs";
import { CondBodySet } from "../../packs/_core.control-flow/nodes.cjs";

export function IfStatement(ast: ASTTypes["IfStatement"]) {
    const lispifySignature = (sign: CondBodySet) => `${sign.condition?.lispify()} ${sign.body?.lispify()})`;

    const mainBranch = `(if ${lispifySignature(ast.ifSignature)}`;

    const elifBranches = ast.elifSignatures
        .map(sign => lispifySignature(sign))
        .map(sign => `(elif ${sign})`)
        .join(" ");

    const elseBranch = ast.elseSignature != null
        ? `(else ${lispifySignature(ast.elseSignature)})`
        : "";

    const parts = [mainBranch];
    if (elifBranches) parts.push(elifBranches);
    if (elseBranch) parts.push(elseBranch);
    return parts.join("");
}

export function WhileStatement(ast: ASTTypes["WhileStatement"]) {
    return `(while ${ast.condition.lispify()} ${ast.body.lispify()})`;
}

export function ForStatement(ast: ASTTypes["ForStatement"]) {
    return `(for ${ast.declaration.lispify()} ${ast.condition.lispify()} ${ast.increment.lispify()} ${ast.body.lispify()})`;
}

export function ForOfStatement(ast: ASTTypes["ForOfStatement"]) {
    return `(for ${ast.declaration.lispify()} of ${ast.iterable.lispify()} ${ast.body.lispify()})`;
}

export function RepeatStatement(ast: ASTTypes["RepeatStatement"]) {
    return `(repeat ${ast.count.lispify()} ${ast.body.lispify()})`;
}

export function ChooseStatement(ast: ASTTypes["ChooseStatement"]) {
    const cases = ast.weights
        .map((weight, i) => `(${weight.lispify()} ${ast.bodies[i]?.lispify()})`)
        .join(" ");
    return `(choose ${cases})`;
}

export function ReturnStatement(ast: ASTTypes["ReturnStatement"]) {
    const value = ast.value ? ast.value.lispify() : "";
    return `(return ${value})`;
}
