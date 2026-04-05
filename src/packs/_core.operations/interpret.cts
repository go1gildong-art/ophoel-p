import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function BinaryOperation(ast: ASTTypes["BinaryOperation"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function PreUnary(ast: ASTTypes["PreUnary"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function PostUnary(ast: ASTTypes["PostUnary"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function IndexAccess(ast: ASTTypes["IndexAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function MemberAccess(ast: ASTTypes["MemberAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function FunctionCall(ast: ASTTypes["FunctionCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function MacroCall(ast: ASTTypes["MacroCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
