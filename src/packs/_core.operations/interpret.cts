import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function BinaryOperation(ast: ASTTypes["BinaryOperation"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "BinaryOperation: not implemented yet" };
}

export function PreUnary(ast: ASTTypes["PreUnary"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "PreUnary: not implemented yet" };
}

export function PostUnary(ast: ASTTypes["PostUnary"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "PostUnary: not implemented yet" };
}

export function IndexAccess(ast: ASTTypes["IndexAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "IndexAccess: not implemented yet" };
}

export function MemberAccess(ast: ASTTypes["MemberAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "MemberAccess: not implemented yet" };
}

export function FunctionCall(ast: ASTTypes["FunctionCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "FunctionCall: not implemented yet" };
}

export function VariableAssign(ast: ASTTypes["VariableAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "VariableAssign: not implemented yet" };
}

export function CompoundAssign(ast: ASTTypes["CompoundAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "CompoundAssign: not implemented yet" };
}

export function MacroCall(ast: ASTTypes["MacroCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "MacroCall: not implemented yet" };
}
