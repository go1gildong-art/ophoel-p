import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function IfStatement(ast: ASTTypes["IfStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function WhileStatement(ast: ASTTypes["WhileStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function ForStatement(ast: ASTTypes["ForStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function ForOfStatement(ast: ASTTypes["ForOfStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function RepeatStatement(ast: ASTTypes["RepeatStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function ChooseStatement(ast: ASTTypes["ChooseStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function ReturnStatement(ast: ASTTypes["ReturnStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
