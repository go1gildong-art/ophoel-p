import { Location } from "../location.cjs";

export enum IRKind {
    Command = "COMMAND",
    Comment = "COMMENT",
}

export interface IRNode {
    kind: IRKind;
    location?: Location;

    toString(): string;
    nonLocString(): string;
    codeGen(): string;
}

export class IRInstructions {
    constructor(
        public instructions: IRNode[]) { }

    toString() { return this.instructions.map(i => i.toString()).join("\n"); }
    nonLocString() { return this.instructions.map(i => i.nonLocString()).join("\n"); }
    codeGen() { return this.instructions.map(i => i.codeGen()).join("\n"); }
}