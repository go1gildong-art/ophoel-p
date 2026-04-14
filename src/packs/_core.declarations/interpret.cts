import { makeOphoelError, OphoelError, OphoelTSError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs";

export async function ConstDecl(ast: ASTTypes["ConstDecl"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        const initValue = await ast.initValue.evaluate(ctx.wrap());
        if (!initValue.ok) return initValue;
        ctx = initValue.ctx.branch();

        ctx.addVariable(ast.name, initValue.value, false);

        return res.makeOK(initValue.value, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function FunctionDecl(ast: ASTTypes["FunctionDecl"], _ctx: Context): Promise<InterpretReturn> {
    const msg = "FunctionDecl: not implemented yet";
    return res.makeErr(new Error(msg));
}

export async function MacroDecl(ast: ASTTypes["MacroDecl"], _ctx: Context): Promise<InterpretReturn> {
    const msg = "MacroDecl: not implemented yet";
    return res.makeErr(new Error(msg));
}

export async function VariableDecl(ast: ASTTypes["VariableDecl"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();

    try {
        const initValue = await ast.initValue.evaluate(ctx.wrap());
        if (!initValue.ok) return initValue;
        ctx = initValue.ctx.branch();

        ctx.addVariable(ast.name, initValue.value, true);

        return {
            ok: true,
            ctx: ctx.wrap(),
            value: initValue.value
        };

    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}
