import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function Identifier(ast: ASTTypes["Identifier"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();
    const $address = ctx.peek().variables.find(v => v.field === ast.name)?.value;

    if (!$address) {
        return { ok: false, err: new Error(`Identifier '${ast.name}' not found`) };
    }

    return { ok: true, ctx: ctx.wrap(), value: $address };
}

export function ParenExpression(ast: ASTTypes["ParenExpression"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();
    const value = ast.expression.evaluate(ctx.branch());
    if (!value.ok) return value;

    return { ok: true, ctx: ctx.wrap(), value: value.value };
}
