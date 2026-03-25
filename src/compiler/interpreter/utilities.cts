import { IRInstructions, IRNode } from "../../ir/ir.cjs";

type InterpretReturn = {
    ok: true;
    ctx: Context;
    value?: OphoelType;
} | {
    ok: false;
    err: unknown
}

class Context {
    readonly frames: Frame[] = [];
    instructions: IRNode[] = [];
}

type Frame = {
    variables: Record<string, OphoelType>;
    mcPrefix?: string
}



type OphoelType =
  | { type: "bool"; value: boolean }
  | { type: "num"; value: number }
  | { type: "string"; value: string }
  | { type: "vector"; value: OphoelType[] }
  | { type: "compound"; value: Record<string, OphoelType> };