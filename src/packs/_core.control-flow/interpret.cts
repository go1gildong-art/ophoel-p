import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs"

export function IfStatement(ast: ASTTypes["IfStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("IfStatement: not implemented yet") };
}

export function WhileStatement(ast: ASTTypes["WhileStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("WhileStatement: not implemented yet") };
}

export function ForStatement(ast: ASTTypes["ForStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("ForStatement: not implemented yet") };
}

export function ForOfStatement(ast: ASTTypes["ForOfStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("ForOfStatement: not implemented yet") };
}

export function RepeatStatement(ast: ASTTypes["RepeatStatement"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const times = ast.count.evaluate(ctx.wrap());
    if (!times.ok) return times;
    ctx = times.ctx.branch();

    if (times.value.type !== "num") {
        const msg = `RepeatStatement: expected a number for repeat count, but got ${times.value.value} (${times.value.type})`;
        return res.makeErr(new Error(msg));
    }

    for (let i = 0; i < times.value.value; i++) {
        const body = ast.body.evaluate(ctx.wrap());
        if (!body.ok) return body;
        ctx = body.ctx.branch();
    }

    return res.makeOK({ type: "void", value: null }, ctx.wrap());
}

export function ChooseStatement(ast: ASTTypes["ChooseStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("ChooseStatement: not implemented yet") };
}

export function ReturnStatement(ast: ASTTypes["ReturnStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("ReturnStatement: not implemented yet") };
}
