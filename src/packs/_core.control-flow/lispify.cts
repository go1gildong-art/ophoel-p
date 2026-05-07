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

export function ForEachStatement(ast: ASTTypes["ForEachStatement"]) {
    const signature = ast.index
    ? `(${ast.iterator}, ${ast.index})`
    : ast.iterator;
    
    return `(${ast.iterable.lispify()} -> ${signature} ${ast.body.lispify()})`;
}

export function RepeatStatement(ast: ASTTypes["RepeatStatement"]) {
    const count = ast.index
        ? `(${ast.count.lispify()} -> ${ast.index})`
        : ast.count.lispify();
        
    return `(repeat ${count} ${ast.body.lispify()})`;
}

export function ChooseStatement(ast: ASTTypes["ChooseStatement"]) {
    const cases = ast.entries
        .map((entry, i) => `(${entry.weight?.lispify() ?? "none"} ${entry.body.lispify()})`)
        .join(" ");
    return `(choose ${cases})`;
}

export function ReturnStatement(ast: ASTTypes["ReturnStatement"]) {
    const value = ast.value ? ast.value.lispify() : "";
    return `(return ${value})`;
}
