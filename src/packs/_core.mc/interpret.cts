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
    let ctx = _ctx.branch();
    try {

        const prefix = await ast.prefix.evaluate(ctx.wrap());
        if (!prefix.ok) return prefix;
        ctx = prefix.ctx.branch();

        const coerced = await coerce(prefix.value, "string", ctx.wrap(), ast);
        if (!coerced.ok) return coerced;
        ctx = coerced.ctx.branch();
        const coerced_f = coerced.value.value;

        if (typeof coerced_f !== "string") {
            const msg = "NEVER non string passed into mc execute";
            return res.makeErr(new Error(msg));
        }
        ctx.queuePrefix(coerced.value.value);

        ctx.pushFrame();

        const body = await ast.body.evaluate(ctx.wrap());
        if (!body.ok) return body;
        ctx = body.ctx.branch();

        ctx.popFrame();

        return res.makeOK({ type: "void", value: null }, ctx.wrap())
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}
