import { Context, InterpretReturn, OphoelValue } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";


export async function Print(ast: ASTTypes["Print"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        const content = await ast.content.evaluate(ctx.wrap());
        if (!content.ok) throw content.err;
        ctx = content.ctx.branch();

        ctx.logs.push(content.value);
        
        return {
            ok: true,
            ctx: ctx.wrap(),
            value: { type: "void", value: null }
        }

    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}
