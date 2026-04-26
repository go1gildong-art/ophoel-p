import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn, MacroObject, OphoelValue } from "../../compiler/interpreter/utilities.cjs";
import * as res from "../../utils/result.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { KVPair } from "../../compiler/interpreter/utilities.cjs";
import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";

export async function BoolLiteral(ast: ASTTypes["BoolLiteral"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("BoolLiteral: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function CompoundLiteral(ast: ASTTypes["CompoundLiteral"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        let acc = [] as KVPair[];

        for (let i = 0; i < ast.keys.length; i++) {
            const key = ast.keys[i];
            const value = ast.values[i];
            if (!key) return res.makeErr(await OphoelError.fromNode(`CompoundLiteral: missing key for index '${i}'`, ast, ctx.fm));
            if (!value) return res.makeErr(await OphoelError.fromNode(`CompoundLiteral: missing value for key '${key}'`, ast, ctx.fm));

            const result = await value.evaluate(ctx.wrap());
            if (!result.ok) return result;

            ctx = result.ctx.branch();
            acc.push({
                field: key,
                value: result.value
            });
        }

        return res.makeOK({ type: "compound", value: acc }, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function FloatLiteral(ast: ASTTypes["FloatLiteral"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("FloatLiteral: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function IntLiteral(ast: ASTTypes["IntLiteral"], _ctx: Context): Promise<InterpretReturn> {
    const numValue = parseInt(ast.raw);

    if (isNaN(numValue)) {
        return { ok: false, err: await OphoelError.fromNode(`IntLiteral: unable to parse '${ast.raw}' as an integer`, ast, _ctx.fm as FileManager) };
    }

    return {
        ok: true,
        ctx: _ctx,
        value: { type: "num", value: numValue }
    };
}

export async function StringLiteral(ast: ASTTypes["StringLiteral"], _ctx: Context): Promise<InterpretReturn> {
    return {
        ok: true,
        ctx: _ctx,
        value: { type: "string", value: ast.raw }
    };
}

export async function TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const exprBuffer = [] as OphoelValue["value"][];

        for (const expr of ast.expressions) {
            const res = await expr.evaluate(ctx.wrap());
            if (!res.ok) return res;
            ctx = res.ctx.branch();

            const coerced = await coerce(res.value, "string", ctx.wrap(), ast);
            if (!coerced.ok) return coerced;
            ctx = coerced.ctx.branch();
            exprBuffer.push(coerced.value.value);
        }



        const total = ast.quasis.flatMap((x, i) =>
            exprBuffer[i] !== undefined ? [x, exprBuffer[i]] : [x]
        );

        return res.makeOK({
            type: "string",
            value: total.join("")
        }, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function VectorLiteral(ast: ASTTypes["VectorLiteral"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        let acc = [] as OphoelValue[];

        for (const expr of ast.entries) {
            const res = await expr.evaluate(ctx.wrap());
            if (!res.ok) return res;

            ctx = res.ctx.branch();
            acc.push(res.value);
        }

        return res.makeOK({ type: "vector", value: acc }, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function MacroLiteral(ast: ASTTypes["MacroLiteral"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        type Macro = Extract<OphoelValue, {type: "macro"}>;

        const result =  res.makeOK<Macro, Context, InterpretReturn>({ type: "macro", value: {
            parameters: ast.parameters,
            body: ast.body,
            closure: ctx.wrap()
        } } as Macro, ctx.wrap());
        
        return result;
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}