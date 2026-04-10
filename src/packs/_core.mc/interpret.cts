import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";


export function McCommand(ast: ASTTypes["McCommand"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const argResult = ast.argument.evaluate(_ctx);
    if (!argResult.ok) throw argResult.err;
    ctx = argResult.ctx.branch();

    const coerced = coerce(argResult.value, "string", ctx.wrap());
    if (!coerced.ok) return coerced;
    ctx = coerced.ctx.branch();
    
    ctx.emitCmd(`${ast.command} ${coerced.value}`, ast.location);

    return { ok: true, 
        ctx: ctx.wrap(),
        value: { type: "void", value: null }
    };
}

export function McExecStatement(ast: ASTTypes["McExecStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("McExecStatement: not implemented yet") };
}
