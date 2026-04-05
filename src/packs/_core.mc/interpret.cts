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

export function McCommand(ast: ASTTypes["McCommand"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}

export function McExecStatement(ast: ASTTypes["McExecStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
