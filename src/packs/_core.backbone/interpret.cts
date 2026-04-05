import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";


export function Block(ast: ASTTypes["Block"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    for (const stmt of ast.statements) {
        const res = stmt.evaluate(ctx);
        if (!res.ok) throw res.err;
        ctx = res.ctx.branch();
    }
    
    return {
        ok: true,
        ctx: ctx.wrap(),
        value: { type: "void" }
    }
}

export function ExecExpr(ast: ASTTypes["ExecExpr"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const result = ast.expression.evaluate(ctx);
    if (!result.ok) throw result.err;

    return {
        ok: true,
        ctx: result.ctx,
        value: { type: "void" }
    }
}

export function Program(ast: ASTTypes["Program"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    for (const stmt of ast.body) {
        const res = stmt.evaluate(ctx);
        if (!res.ok) throw res.err;
        ctx = res.ctx.branch();
    }

    return {
        ok: true,
        ctx: ctx.wrap(),
        value: { type: "void" }
    }
}
