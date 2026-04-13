import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs"


export async function McCommand(ast: ASTTypes["McCommand"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();

    const argResult = await ast.argument.evaluate(_ctx);
    if (!argResult.ok) throw argResult.err;
    ctx = argResult.ctx.branch();

    const coerced = coerce(argResult.value, "string", ctx.wrap());
    if (!coerced.ok) return coerced;
    ctx = coerced.ctx.branch();
    
    ctx.emitCmd(`${ast.command} ${coerced.value.value}`, ast.location);

    return res.makeOK({ type: "void", value: null }, ctx.wrap())
}

export async function McExecStatement(ast: ASTTypes["McExecStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: new Error("McExecStatement: not implemented yet") };
}
