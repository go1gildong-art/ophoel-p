import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function BoolLiteral(ast: ASTTypes["BoolLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function CompoundLiteral(ast: ASTTypes["CompoundLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function FloatLiteral(ast: ASTTypes["FloatLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function IntLiteral(ast: ASTTypes["IntLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function StringLiteral(ast: ASTTypes["StringLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function VectorLiteral(ast: ASTTypes["VectorLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
