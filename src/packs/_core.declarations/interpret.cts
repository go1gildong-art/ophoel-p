import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export async function ConstDecl(ast: ASTTypes["ConstDecl"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    
    const initValue = await ast.initValue.evaluate(ctx.wrap());
    if (!initValue.ok) return initValue;
    ctx = initValue.ctx.branch();

    ctx.addVariable(ast.name, initValue.value, false);

    return {
        ok: true,
        ctx: ctx.wrap(),
        value: initValue.value
    };
}

export async function FunctionDecl(ast: ASTTypes["FunctionDecl"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("FunctionDecl: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function MacroDecl(ast: ASTTypes["MacroDecl"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("MacroDecl: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function VariableDecl(ast: ASTTypes["VariableDecl"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    
    const initValue = await ast.initValue.evaluate(ctx.wrap());
    if (!initValue.ok) return initValue;
    ctx = initValue.ctx.branch();

    ctx.addVariable(ast.name, initValue.value, true);

    return {
        ok: true,
        ctx: ctx.wrap(),
        value: initValue.value
    };
}
