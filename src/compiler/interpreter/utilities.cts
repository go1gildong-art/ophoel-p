import { IRInstructions, IRNode } from "../../ir/ir.cjs";
import { OphoelValue } from "../../ast/types.cjs";

export type InterpretReturn = {
    ok: true;
    ctx: Context;
    value?: OphoelValue;
} | {
    ok: false;
    err: unknown
}

export class Context {
    readonly frames: Frame[] = [];
    instructions: IRNode[] = [];
}

type Frame = {
    variables: Record<string, OphoelValue>;
    mcPrefix?: string
}



