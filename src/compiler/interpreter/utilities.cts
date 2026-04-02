import { Statement } from "../../ast.cjs";
import { IRInstructions, IRNode } from "../../ir/ir.cjs";

export type InterpretReturn = {
    ok: true;
    ctx: Context;
    value?: OphoelValue;
} | {
    ok: false;
    err: unknown
}

export type OphoelValue =
  | { type: "bool"; value: boolean }
  | { type: "num"; value: number }
  | { type: "string"; value: string }
  | { type: "vector"; value: OphoelValue[] }
  | { type: "compound"; value: Record<string, OphoelValue> }
  | { type: "void"};

export class Context {
    readonly frames: Frame[] = [];
    instructions: IRNode[] = [];
}

type Frame = {
    variables: Record<string, OphoelValue>;
    mcPrefix?: string
}



