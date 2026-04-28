import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs"
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";

export async function IfStatement(ast: ASTTypes["IfStatement"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();

    try {

        const signatures = [ast.ifSignature, ...ast.elifSignatures, ast.elseSignature];
        for (const signature of signatures) {
            if (!signature) continue;
            if (signature.condition === null) return await signature.body.evaluate(ctx.wrap());

            const cond = await signature.condition.evaluate(ctx.wrap());
            if (!cond.ok) return cond;
            ctx = cond.ctx.branch();

            const coerced = await coerce(cond.value, "bool", ctx.wrap(), ast);
            if (!coerced.ok) return coerced;
            ctx = coerced.ctx.branch();

            if (coerced.value.value) {
                const result = await signature.body.evaluate(ctx.wrap());
                return result;
            }
        }

        return res.makeOK({ type: "void", value: null }, ctx.wrap());


    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function WhileStatement(ast: ASTTypes["WhileStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("WhileStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function ForStatement(ast: ASTTypes["ForStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ForStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function ForOfStatement(ast: ASTTypes["ForOfStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ForOfStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function RepeatStatement(ast: ASTTypes["RepeatStatement"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const times = await ast.count.evaluate(ctx.wrap());
        if (!times.ok) return times;
        ctx = times.ctx.branch();

        if (times.value.type !== "num") {
            const msg = `RepeatStatement: expected a number for repeat count, but got ${times.value.value} (${times.value.type})`;
            return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
        }

        for (let i = 0; i < times.value.value; i++) {
            const body = await ast.body.evaluate(ctx.wrap());
            if (!body.ok) return body;
            ctx = body.ctx.branch();
        }

        return res.makeOK({ type: "void", value: null }, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function ChooseStatement(ast: ASTTypes["ChooseStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ChooseStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function ReturnStatement(ast: ASTTypes["ReturnStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ReturnStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}
