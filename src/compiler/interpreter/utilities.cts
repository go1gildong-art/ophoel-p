import { ASTNode, Expression, Statement } from "../../ast.cjs";
import { IRs } from "../../ir/ir-collection.cjs";
import { IRInstructions, IRKind, IRNode } from "../../ir/ir.cjs";
import { Location } from "../../location.cjs";
import * as p from "../../pack-combinator.cjs";
import * as res from "@utils/result.cjs";
import { FileManager, FileManagerClass, FMPlaceholder } from "../file-manager.cjs";
import { OphoelError } from "./error.cjs";
import { Block } from "../../packs/_core.backbone/nodes.cjs";

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
    | { type: "void"; value: null }
    | { type: "macro"; value: MacroObject };
export type MacroObject = { parameters: string, body: Block | Expression }
export type KVPair = { field: string, value: OphoelValue };

export function moveValue(address: OphoelValue, value: OphoelValue): void {
    address.type = value.type;
    address.value = value.value;
}

export class Context {
    constructor(
        public readonly frames: Frame[] = [],
        public readonly instructions: IRNode[] = [],
        public readonly fm: FileManager = new FMPlaceholder("uninitialized"),
        public readonly includeTrace: string[] = []
    ) { }

    branch(this: Context) {
        return new ContextMut(
            this.frames, 
            this.instructions, 
            this.fm, 
            this.includeTrace
        );
    }

    static new(fm: FileManagerClass) {
        return new Context([emptyFrame()], [], fm);
    }

    static newPlaceheld(src: string) {
        return new Context([emptyFrame()], [], new FMPlaceholder(src));
    }
}

export class ContextMut {
    constructor(
        public frames: Frame[] = [],
        public instructions: IRNode[] = [],
        public fm: FileManager = new FMPlaceholder("uninitialized"),
        public includeTrace: string[] = []
    ) { }

    private makeOK(value: OphoelValue = { type: "void", value: null }): InterpretReturn {
        return res.makeOK(value, this.wrap());
    }

    peek(): Frame {
        const frame = this.frames.at(-1);
        if (!frame) throw new Error("No frames in context");
        return frame;
    }

    pushFrame(frame: Frame = emptyFrame()) {
        if (this.peek().queuedPrefix != null) {
            frame.mcPrefix = this.peek().queuedPrefix;
            this.peek().queuedPrefix = undefined;
        }

        this.frames.push(frame);
    }

    popFrame() { this.frames.pop(); }

    addVariable(field: string, value: OphoelValue, mutable: boolean) {
        this.peek().variables.push({ field, value, mutable });
    }

    async getVariable(ident: string): Promise<InterpretReturn> {
        for (const frame of [...this.frames].reverse()) {
            for (const variable of frame.variables) {
                if (variable.field === ident) return this.makeOK(variable.value);
            }
        }

        const msg = `Variable not found: ${ident}`;
        return res.makeErr(new Error(msg));
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
        return new Context(
            this.frames, 
            this.instructions, 
            this.fm, 
            this.includeTrace
        );
    }

    async include(path: string): Promise<InterpretReturn> {
        if (this.includeTrace.some(includeNode => includeNode === path)) {
            const msg = `Recursive include detected for ${path}!`;
            throw new Error(msg);
        }

        this.includeTrace.push(path);
        const ast = await this.fm.getAst(path);
        const newCtx = await ast.evaluate(this.wrap());
        if (newCtx.ok) newCtx.ctx.branch().includeTrace.pop();
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


