import { Location } from "../../compiler/metadata.cjs";
import { IRKind, IRNode } from "../ir.cjs";

export class Command implements IRNode {
    kind: IRKind = IRKind.Command;

    constructor(
        public message: string,
        public location?: Location) { }

    toString() {
        return `cmd /${this.message} | ${this.location?.toString() ?? 'u'}`;
    }
}

export class Comment implements IRNode {
    kind: IRKind = IRKind.Comment;

    constructor(
        public message: string,
        public location?: Location) { }

    toString() {
        return `/#  ${this.message} | ${this.location?.toString() ?? 'unknown location'}`;
    }
}