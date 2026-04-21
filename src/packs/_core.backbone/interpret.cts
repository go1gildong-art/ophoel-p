import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";


export async function Block(ast: ASTTypes["Block"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        ctx.pushFrame();

        for (const stmt of ast.statements) {
            const res = await stmt.evaluate(ctx.wrap());
            if (!res.ok) throw res.err;

            ctx = res.ctx.branch();
        }

        ctx.popFrame();
        return {
            ok: true,
            ctx: ctx.wrap(),
            value: { type: "void", value: null }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function ExecExpr(ast: ASTTypes["ExecExpr"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const result = await ast.expression.evaluate(ctx.wrap());
        if (!result.ok) throw result.err;
        ctx = result.ctx.branch();

        return {
            ok: true,
            ctx: result.ctx,
            value: { type: "void", value: null }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function Program(ast: ASTTypes["Program"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        for (const stmt of ast.body) {
            const res = await stmt.evaluate(ctx.wrap());
            if (!res.ok) throw res.err;
            ctx = res.ctx.branch();
        }

        return {
            ok: true,
            ctx: ctx.wrap(),
            value: { type: "void", value: null }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}
