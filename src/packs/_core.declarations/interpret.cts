import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function ConstDecl(ast: ASTTypes["ConstDecl"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function FunctionDecl(ast: ASTTypes["FunctionDecl"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function MacroDecl(ast: ASTTypes["MacroDecl"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function VariableDecl(ast: ASTTypes["VariableDecl"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
