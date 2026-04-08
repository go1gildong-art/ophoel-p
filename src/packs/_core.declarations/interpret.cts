import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function ConstDecl(ast: ASTTypes["ConstDecl"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();
    
    const initValue = ast.initValue.evaluate(ctx);
    if (!initValue.ok) return initValue;

    ctx.addVariable(ast.name, initValue.value, false);

    return {
        ok: true,
        ctx,
        value: initValue.value
    };
}

export function FunctionDecl(ast: ASTTypes["FunctionDecl"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("FunctionDecl: not implemented yet") };
}

export function MacroDecl(ast: ASTTypes["MacroDecl"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("MacroDecl: not implemented yet") };
}

export function VariableDecl(ast: ASTTypes["VariableDecl"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();
    
    const initValue = ast.initValue.evaluate(ctx);
    if (!initValue.ok) return initValue;

    ctx.addVariable(ast.name, initValue.value, true);

    return {
        ok: true,
        ctx,
        value: initValue.value
    };
}
