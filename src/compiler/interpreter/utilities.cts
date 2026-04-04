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
    | { type: "compound"; value: Record<string, OphoelValue> }
    | { type: "void" };



export class Context {
    readonly frames: Frame[] = [];
    readonly instructions: IRNode[] = [];
}

export class ContextMut extends Context {
    private makeOK(value?: OphoelValue): InterpretReturn {
        return {
            ok: true,
            ctx: this,
            value: value ?? { type: "void" }
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

    pushFrame(frame: Frame = { variables: {}, mcPrefix: undefined }) {
        if (this.peek().queuedPrefix != null) {
            frame.mcPrefix = this.peek().queuedPrefix;
        }

        this.frames.push(frame);
    }

    popFrame() { this.frames.pop(); }

    getVariable(ident: string): InterpretReturn {
        for (const frame of [...this.frames].reverse()) {
            if (frame.variables[ident] != null) {
                return this.makeOK(frame.variables[ident]);
            }
        }

        return {
            ok: false,
            err: new Error(`Variable not found: ${ident}`)
        };
    }

    getAddressObj(ident: string): Record<string, OphoelValue> | { ok: false; err: Error } {
        for (const frame of [...this.frames].reverse()) {
            if (frame.variables[ident] != null) {
                return frame.variables;
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
        const prefix = this.frames
            .reverse()
            .filter(frame => frame.mcPrefix != null)
            .map(frame => frame.mcPrefix!)
            .join(" ");

        this.instructions.push(
            new IRs.Command(prefix ? `execute ${prefix} run ${cmd}` : cmd, location)
        );
    }
}

type Frame = {
    variables: Record<string, OphoelValue>;
    mcPrefix?: string
    queuedPrefix?: string;
}



