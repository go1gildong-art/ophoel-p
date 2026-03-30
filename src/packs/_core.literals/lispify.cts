import { ASTTypes } from "../../ast/ast-collection.cjs";
import { lispify as baseLispify } from "../../stringifiers/lispify.cjs";

export function IntLiteral(ast: ASTTypes["IntLiteral"]) {
    return ast.raw;
}

export function FloatLiteral(ast: ASTTypes["FloatLiteral"]) {
    return ast.raw;
}

export function BoolLiteral(ast: ASTTypes["BoolLiteral"]) {
    return ast.raw;
}

export function StringLiteral(ast: ASTTypes["StringLiteral"]) {
    return `'${ast.raw}'`;
}

export function TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"]) {
    return `\`${ast.raw}\``;
}

export function VectorLiteral(ast: ASTTypes["VectorLiteral"]) {
    const entries = ast.entries.map(e => baseLispify(e)).join(" ");
    return `(${entries})`;
}

export function CompoundLiteral(ast: ASTTypes["CompoundLiteral"]) {
    const pairs = ast.keys
        .map((key, i) => `(${key} ${baseLispify(ast.values[i])})`)
        .join(" ");

    return `(${pairs})`;
}
