import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";

export async function Identifier(ast: ASTTypes["Identifier"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
try {
    const address = await ctx.getVariable(ast.name, ast);
    if (!address.ok) return address;

    return { ok: true, ctx: ctx.wrap(), value: address.value };
} catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function ParenExpression(ast: ASTTypes["ParenExpression"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
try {
    const value = await ast.expression.evaluate(ctx.wrap());
    if (!value.ok) return value;
    ctx = value.ctx.branch();

    return { ok: true, ctx: ctx.wrap(), value: value.value };
} catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}
