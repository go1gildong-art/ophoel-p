import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function BinaryOperation(ast: ASTTypes["BinaryOperation"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("BinaryOperation: not implemented yet") };
}

export function PreUnary(ast: ASTTypes["PreUnary"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("PreUnary: not implemented yet") };
}

export function PostUnary(ast: ASTTypes["PostUnary"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("PostUnary: not implemented yet") };
}

export function IndexAccess(ast: ASTTypes["IndexAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("IndexAccess: not implemented yet") };
}

export function MemberAccess(ast: ASTTypes["MemberAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("MemberAccess: not implemented yet") };
}

export function FunctionCall(ast: ASTTypes["FunctionCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("FunctionCall: not implemented yet") };
}

export function VariableAssign(ast: ASTTypes["VariableAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("VariableAssign: not implemented yet") };
}

export function CompoundAssign(ast: ASTTypes["CompoundAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("CompoundAssign: not implemented yet") };
}

export function MacroCall(ast: ASTTypes["MacroCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("MacroCall: not implemented yet") };
}
