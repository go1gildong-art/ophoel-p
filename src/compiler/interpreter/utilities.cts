import { ASTNode, Statement } from "../../ast.cjs";
import { IRs } from "../../ir/ir-collection.cjs";
import { IRInstructions, IRKind, IRNode } from "../../ir/ir.cjs";
import { Location } from "../../location.cjs";
import * as p from "../../pack-combinator.cjs";

export type InterpretReturn = {
    ok: true;
    ctx: Context;
    value: OphoelValue;
} | {
    ok: false;
    err: unknown
}

export type OphoelValue =
    | { type: "bool"; value: boolean }
    | { type: "num"; value: number }
    | { type: "string"; value: string }
    | { type: "vector"; value: OphoelValue[] }
    | { type: "compound"; value: KVPair[] }
    | { type: "void"; value: null };
export type KVPair = { field: string, value: OphoelValue };

export function moveValue(address: OphoelValue, value: OphoelValue): void {
    address.type = value.type;
    address.value = value.value;
}


export class Context {
    readonly frames: Frame[] = [];
    readonly instructions: IRNode[] = [];

    branch(): ContextMut {
        const newCtx = new ContextMut();
        newCtx.frames.push(...this.frames);
        newCtx.instructions.push(...this.instructions);
        return newCtx;
    }

    static new() {
        const ctx = {
            frames: [emptyFrame()],
            instructions: [] as IRNode[],
            branch: function() {
                const newCtx = new ContextMut();
                newCtx.frames.push(...this.frames);
                newCtx.instructions.push(...this.instructions);
                return newCtx;
            }
        } as Context;
        return ctx;
    }
}

export class ContextMut {
    readonly frames: Frame[] = [];
    readonly instructions: IRNode[] = [];

    private makeOK(value?: OphoelValue): InterpretReturn {
        return {
            ok: true,
            ctx: this.wrap(),
            value: value ?? { type: "void", value: null }
        };
    }

    private makeErr(err?: unknown): InterpretReturn {
        return {
            ok: false,
            err: err ?? new Error("An unexpected error occurred during interpretation")
        };
    }

    peek(): Frame {
        const frame = this.frames.at(-1);
        if (!frame) throw new Error("No frames in context");
        return frame;
    }

    pushFrame(frame: Frame = emptyFrame()) {
        if (this.peek().queuedPrefix != null) {
            frame.mcPrefix = this.peek().queuedPrefix;
        }

        this.frames.push(frame);
    }

    popFrame() { this.frames.pop(); }

    addVariable(field: string, value: OphoelValue, mutable: boolean) {
        this.peek().variables.push({ field, value, mutable });
    }

    getVariable(ident: string): InterpretReturn {
        if (ident === "repeat_check") console.log(this.frames.map(f => f.variables));
        for (const frame of [...this.frames].reverse()) {
            for (const variable of frame.variables) {
                if (variable.field === ident) return this.makeOK(variable.value);
            }
        }

        return {
            ok: false,
            err: new Error(`Variable not found: ${ident}`)
        };
    }

 
    queuePrefix(prefix: string) {
        this.peek().queuedPrefix = prefix;
    }

    emitCmd(cmd: string, location: Location) {
        const prefix = [...this.frames]
            .reverse()
            .filter(frame => frame.mcPrefix != null)
            .map(frame => frame.mcPrefix!)
            .join(" ");

        this.instructions.push(
            new IRs.Command(prefix ? `execute ${prefix} run ${cmd}` : cmd, location)
        );
    }

    wrap(): Context {
        const newCtx = new Context();
        newCtx.frames.push(...this.frames);
        newCtx.instructions.push(...this.instructions);
        return newCtx;
    }

    export() {
        return new IRInstructions(this.instructions);
    }
}

type Frame = {
    variables: { field: string, value: OphoelValue, mutable: boolean }[];
    mcPrefix?: string
    queuedPrefix?: string;
}
const emptyFrame: () => Frame = () => ({ variables: [], mcPrefix: undefined, queuedPrefix: undefined });


