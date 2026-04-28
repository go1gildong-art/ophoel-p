import { Context, InterpretReturn, OphoelValue } from "./utilities.cjs";
import * as res from "../../utils/result.cjs";
import { OphoelError } from "./error.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";


type CoerceFn = (v: OphoelValue) => OphoelValue;
const coerceMaps: Record<
    string,
    Partial<Record<string, CoerceFn>>
> = {
    num: {
        string: (v) => ({ type: "string", value: `${v.value}` }),
    },
    bool: {
        string: (v) => ({ type: "string", value: `${v.value}` }),
    }
}


export async function coerce(from: OphoelValue, toType: OphoelValue["type"], ctx: Context, node: ASTTypes[keyof ASTTypes]): Promise<InterpretReturn> {
    if (from.type === toType) return res.makeOK(from, ctx);
    const transform = coerceMaps[from.type]?.[toType];

    if (!transform) {
        const msg = `Not coercible from ${from.value} (${from.type}) to type ${toType}`;
        return res.makeErr(await OphoelError.fromNode(msg, node, ctx.fm));
    }

    return res.makeOK(transform(from), ctx)
}