import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs"
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";


export async function McCommand(ast: ASTTypes["McCommand"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
try {

    const argResult = await ast.argument.evaluate(_ctx);
    if (!argResult.ok) throw argResult.err;
    ctx = argResult.ctx.branch();

    const coerced = await coerce(argResult.value, "string", ctx.wrap(), ast);
    if (!coerced.ok) return coerced;
    ctx = coerced.ctx.branch();
    
    ctx.emitCmd(`${ast.command} ${coerced.value.value}`, ast.location);

    return res.makeOK({ type: "void", value: null }, ctx.wrap())
} catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function McExecStatement(ast: ASTTypes["McExecStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("McExecStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}
