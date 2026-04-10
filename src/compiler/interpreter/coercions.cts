import { Context, InterpretReturn, OphoelValue } from "./utilities.cjs";
import * as res from "../../utils/result.cjs";


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


export function coerce(from: OphoelValue, toType: OphoelValue["type"], ctx: Context): InterpretReturn {
    if (from.type === toType) return res.makeOK(from, ctx);
    const transform = coerceMaps[from.type]?.[toType];

    if (!transform) {
        const msg = `Non-coercible from ${from.value} (${from.type}) to type ${toType}`;
        return res.makeErr(new Error(msg));
    }

    return res.makeOK(
        transform(from),
        ctx
    )
}