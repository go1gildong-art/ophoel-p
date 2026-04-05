import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function Identifier(ast: ASTTypes["Identifier"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function ParenExpression(ast: ASTTypes["ParenExpression"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function VariableAssign(ast: ASTTypes["VariableAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function CompoundAssign(ast: ASTTypes["CompoundAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
