import { Context, InterpretReturn, OphoelValue } from "../../compiler/interpreter/utilities.cjs";
import * as res from "../../utils/result.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { KVPair } from "../../compiler/interpreter/utilities.cjs";
import { coerce } from "../../compiler/interpreter/coercions.cjs";

export function BoolLiteral(ast: ASTTypes["BoolLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("BoolLiteral: not implemented yet") };
}

export function CompoundLiteral(ast: ASTTypes["CompoundLiteral"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();
    let acc = [] as KVPair[];

    for (let i = 0; i < ast.keys.length; i++) {
        const key = ast.keys[i];
        const value = ast.values[i];
        if (!key) return res.makeErr(new Error(`CompoundLiteral: missing key for index '${i}'`));
        if (!value) return res.makeErr(new Error(`CompoundLiteral: missing value for key '${key}'`));

        const result = value.evaluate(ctx.wrap());
        if (!result.ok) return result;

        ctx = result.ctx.branch();
        acc.push({
            field: key,
            value: result.value
        });
    }

    return res.makeOK({ type: "compound", value: acc }, ctx.wrap());
}

export function FloatLiteral(ast: ASTTypes["FloatLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("FloatLiteral: not implemented yet") };
}

export function IntLiteral(ast: ASTTypes["IntLiteral"], _ctx: Context): InterpretReturn {
    const numValue = parseInt(ast.raw);

    if (isNaN(numValue)) {
        return { ok: false, err: new Error(`IntLiteral: unable to parse '${ast.raw}' as an integer`) };
    }

    return {
        ok: true,
        ctx: _ctx,
        value: { type: "num", value: numValue }
    };
}

export function StringLiteral(ast: ASTTypes["StringLiteral"], _ctx: Context): InterpretReturn {
    return {
        ok: true,
        ctx: _ctx,
        value: { type: "string", value: ast.raw }
    };
}

export function TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const exprBuffer = [] as OphoelValue["value"][];

    for (const expr of ast.expressions) {
        const res = expr.evaluate(ctx.wrap());
        if (!res.ok) return res;
        ctx = res.ctx.branch();

        const coerced = coerce(res.value, "string", ctx.wrap());
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
}

export function VectorLiteral(ast: ASTTypes["VectorLiteral"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();
    let acc = [] as OphoelValue[];

    for (const expr of ast.entries) {
        const res = expr.evaluate(ctx.wrap());
        if (!res.ok) return res;

        ctx = res.ctx.branch();
        acc.push(res.value);
    }

    return res.makeOK({ type: "vector", value: acc }, ctx.wrap());
}
