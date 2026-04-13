import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export async function Identifier(ast: ASTTypes["Identifier"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    const address = ctx.getVariable(ast.name);
    if (!address.ok) return address;

    return { ok: true, ctx: ctx.wrap(), value: address.value };
}

export async function ParenExpression(ast: ASTTypes["ParenExpression"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    const value = await ast.expression.evaluate(ctx.wrap());
    if (!value.ok) return value;
    ctx = value.ctx.branch();

    return { ok: true, ctx: ctx.wrap(), value: value.value };
}
