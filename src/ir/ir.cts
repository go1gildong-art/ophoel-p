import { Location } from "../compiler/metadata.cjs";

export enum IRKind {
    Command = "COMMAND",
    Comment = "COMMENT",
}

export interface IRNode {
    kind: IRKind;
    location?: Location;
}

export class IRInstructions {
    constructor(
        public instructions: IRNode[]) { }

    toString() {
        return this.instructions.map(i => i.toString()).join("\n");
    }
}